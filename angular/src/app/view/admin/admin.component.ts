import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService2 } from "../../../services/proyect2/api.service";
import { ApiService1 } from '../../../services/proyect1/api.service';
import { StyleManagerService } from '../../../services/style.service';
import Swal from 'sweetalert2';

// Declara jQuery globalmente para TypeScript
declare var $: JQueryStatic;
declare var jQuery: JQueryStatic; // Algunos plugins de DataTables o versiones lo requieren

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  // MODULO DE USUARIO

  @ViewChild('activeTable') activeTable!: ElementRef;
  @ViewChild('disabledTable') disabledTable!: ElementRef;

  usersActive: any[] = [];
  usersDesactive: any[] = [];
  vista_modo2: 'activos' | 'deshabilitados' = 'activos';

  usuarioSeleccionado: any = null; // Para el modal de detalles

  activeDataTable: any;
  disabledDataTable: any;

  showUserDetailsModal: boolean = false; // Controla la visibilidad del modal de detalles
  showConfirmModal: boolean = false;
  confirmAction: (() => Promise<void>) | null = null;
  confirmMessage: string = '';

  showAlertModal: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';

  constructor(private userService: ApiService2, private colorFontService : ApiService1, 
    @Inject(PLATFORM_ID) private platformId: Object, private styleManager: StyleManagerService) {

    effect(() => {
      this.applyStylesToElements();
    })
  }

  async ngOnInit() {

    // modulo de colores y fuentes
    this.loadInitialStyles();
    this.fetchSavedStyles();
    this.fetchSavedStylesFont();

    // modulo de usuario
    await this.reloadUsers();
    // Inicializar la tabla aquí después de que los datos estén disponibles
    // y solo si estamos en el navegador.
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => { // Pequeño retraso para asegurar que el DOM esté listo
        this.initDataTables();
        this.setupButtonEvents();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.activeDataTable) {
        this.activeDataTable.destroy();
      }
      if (this.disabledDataTable) {
        this.disabledDataTable.destroy();
      }
      $(document).off('click', '.view-details-btn');
      $(document).off('click', '.disable-user-btn');
      $(document).off('click', '.enable-user-btn');
    }
  }

  /**
   * Carga los usuarios activos y deshabilitados desde el servicio API.
   * Luego, actualiza los datos internos del componente.
   */
  async reloadUsers() {
    try {
      const users = await this.userService.getUsers();
      if (!users) {
        throw new Error('No se recibieron datos de usuarios del servicio.');
      }
      this.usersActive = users.active || [];
      this.usersDesactive = users.desactive || [];

      // Si las tablas ya están inicializadas, refrescar sus datos
      if (isPlatformBrowser(this.platformId) && (this.activeDataTable || this.disabledDataTable)) {
        this.refreshTables();
      }

    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      this.openAlertModal(`Error al cargar usuarios: ${error.message || 'Error desconocido'}`, 'error');
      this.usersActive = [];
      this.usersDesactive = [];
    }
  }

  /**
   * Inicializa la tabla de DataTables según la vista actual.
   * Se encarga de destruir instancias previas para evitar conflictos.
   */
  initDataTables() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Destruir tablas existentes antes de inicializar una nueva
    if (this.activeDataTable) {
      this.activeDataTable.destroy();
      this.activeDataTable = null;
    }
    if (this.disabledDataTable) {
      this.disabledDataTable.destroy();
      this.disabledDataTable = null;
    }

    // Inicializar la tabla correspondiente a la vista_modo2
    if (this.vista_modo2 === 'activos' && this.activeTable) {
      this.activeDataTable = $(this.activeTable.nativeElement).DataTable({
        data: this.usersActive.map(user => [
          `${user.firstName} ${user.lastName}`,
          user.email,
          user.phone,
          '<span class="badge badge-success">Activo</span>', // Clases CSS personalizadas
          this.getActionButtons(user.user_id, 'disable')
        ]),
        columns: [
          { title: "Nombre" },
          { title: "Email" },
          { title: "Teléfono" },
          { title: "Estado" },
          { title: "Acciones", orderable: false, searchable: false }
        ],
        dom: 'Bfrtip', // Mostrar botones de exportación, filtro, paginación
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel"></i> Exportar a Excel', // Icono para Excel
            className: 'custom-btn custom-btn-excel', // Clases CSS personalizadas
            exportOptions: {
              columns: [0, 1, 2, 3]
            }
          },
          {
            extend: 'pdfHtml5',
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF', // Icono para PDF
            className: 'custom-btn custom-btn-pdf', // Clases CSS personalizadas
            exportOptions: {
              columns: [0, 1, 2, 3]
            },
            orientation: 'portrait',
            pageSize: 'A4'
          }
        ],
        responsive: true,
        language: {
          "decimal": "",
          "emptyTable": "No hay información",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
          "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
          "infoFiltered": "(Filtrado de _MAX_ total entradas)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Mostrar _MENU_ Entradas",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Buscar:",
          "zeroRecords": "Sin resultados encontrados",
          "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
          },
          "aria": {
            "sortAscending": ": activar para ordenar columna ascendente",
            "sortDescending": ": activar para ordenar columna descendente"
          },
          "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad de columnas",
            "collection": "Colección",
            "colvisRestore": "Restaurar visibilidad",
            "copyKeys": "Presione Ctrl o u2318 + C para copiar los datos de la tabla al portapapeles.<br><br>Para cancelar, haga clic en este mensaje o presione escape.",
            "copySuccess": {
              "1": "Copiada 1 fila al portapapeles",
              "_": "Copiadas %d filas al portapapeles"
            },
            "copyTitle": "Copiar al portapapeles",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
              "-1": "Mostrar todas las filas",
              "_": "Mostrar %d filas"
            },
            "pdf": "PDF",
            "print": "Imprimir"
          }
        },
        destroy: true
      });

    } else if (this.vista_modo2 === 'deshabilitados' && this.disabledTable) {
      this.disabledDataTable = $(this.disabledTable.nativeElement).DataTable({
        data: this.usersDesactive.map(user => [
          `${user.firstName} ${user.lastName}`,
          user.email,
          user.phone,
          '<span class="badge badge-danger">Inactivo</span>', // Clases CSS personalizadas
          this.getActionButtons(user.user_id, 'enable')
        ]),
        columns: [
          { title: "Nombre" },
          { title: "Email" },
          { title: "Teléfono" },
          { title: "Estado" },
          { title: "Acciones", orderable: false, searchable: false }
        ],
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
            className: 'custom-btn custom-btn-excel',
            exportOptions: {
              columns: [0, 1, 2, 3]
            }
          },
          {
            extend: 'pdfHtml5',
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            className: 'custom-btn custom-btn-pdf',
            exportOptions: {
              columns: [0, 1, 2, 3]
            },
            orientation: 'portrait',
            pageSize: 'A4'
          }
        ],
        responsive: true,
        language: {
          "decimal": "",
          "emptyTable": "No hay información",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
          "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
          "infoFiltered": "(Filtrado de _MAX_ total entradas)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Mostrar _MENU_ Entradas",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Buscar:",
          "zeroRecords": "Sin resultados encontrados",
          "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
          },
          "aria": {
            "sortAscending": ": activar para ordenar columna ascendente",
            "sortDescending": ": activar para ordenar columna descendente"
          },
          "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad de columnas",
            "collection": "Colección",
            "colvisRestore": "Restaurar visibilidad",
            "copyKeys": "Presione Ctrl o u2318 + C para copiar los datos de la tabla al portapapeles.<br><br>Para cancelar, haga clic en este mensaje o presione escape.",
            "copySuccess": {
              "1": "Copiada 1 fila al portapapeles",
              "_": "Copiadas %d filas al portapapeles"
            },
            "copyTitle": "Copiar al portapapeles",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
              "-1": "Mostrar todas las filas",
              "_": "Mostrar %d filas"
            },
            "pdf": "PDF",
            "print": "Imprimir"
          }
        },
        destroy: true
      });
    }
  }

  /**
   * Actualiza los datos de una tabla de DataTables existente.
   */
  refreshTables() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Nota: Si usas `clear()` y `rows.add()`, es crucial que el DOM no se haya destruido/recreado
    // entre reloadUsers y refreshTables. La combinación con setTimeout en changeView y ngOnInit
    // ayuda a asegurar esto.
    if (this.vista_modo2 === 'activos' && this.activeDataTable) {
      this.activeDataTable.clear();
      this.activeDataTable.rows.add(this.usersActive.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.phone,
        '<span class="badge badge-success">Activo</span>',
        this.getActionButtons(user.user_id, 'disable')
      ]));
      this.activeDataTable.draw();
    } else if (this.vista_modo2 === 'deshabilitados' && this.disabledDataTable) {
      this.disabledDataTable.clear();
      this.disabledDataTable.rows.add(this.usersDesactive.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.phone,
        '<span class="badge badge-danger">Inactivo</span>',
        this.getActionButtons(user.user_id, 'enable')
      ]));
      this.disabledDataTable.draw();
    }
  }

  /**
   * Genera el HTML para los botones de acción en cada fila de la tabla.
   * @param userId El ID del usuario.
   * @param type El tipo de acción principal ('disable' o 'enable').
   * @returns String HTML con los botones.
   */
  getActionButtons(userId: string, type: 'disable' | 'enable'): string {
    const disableBtn = `<button class="custom-btn custom-btn-danger custom-btn-sm disable-user-btn" data-user-id="${userId}">❌Desactivar</button>`;
    const enableBtn = `<button class="custom-btn custom-btn-success custom-btn-sm enable-user-btn" data-user-id="${userId}">✅Habilitar</button>`;
    const viewBtn = `<button class="custom-btn custom-btn-info custom-btn-sm custom-me-1 view-details-btn" data-user-id="${userId}">👁️Ver</button>`;

    return `<div class="action-buttons">${viewBtn}${type === 'disable' ? disableBtn : enableBtn}</div>`;
  }

  /**
   * Configura los eventos de click para los botones de acción en las tablas.
   * Se usa delegación de eventos en el documento para manejar elementos generados dinámicamente.
   */
  setupButtonEvents() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    $(document).off('click', '.view-details-btn').on('click', '.view-details-btn', (event: any) => {
      const userId = $(event.currentTarget).data('user-id');
      const user = [...this.usersActive, ...this.usersDesactive].find(u => u.user_id === userId);
      if (user) {
        this.verDetalles(user);
      }
    });

    $(document).off('click', '.disable-user-btn').on('click', '.disable-user-btn', (event: any) => {
      const userId = $(event.currentTarget).data('user-id');
      this.openConfirmModal('¿Estás seguro de que deseas deshabilitar este usuario?', async () => {
        await this.disableUser(userId);
      });
    });

    $(document).off('click', '.enable-user-btn').on('click', '.enable-user-btn', (event: any) => {
      const userId = $(event.currentTarget).data('user-id');
      this.openConfirmModal('¿Estás seguro de que deseas habilitar este usuario?', async () => {
        await this.enableUser(userId);
      });
    });
  }

  /**
   * Cambia la vista de usuarios (activos/deshabilitados) y reinicia la tabla.
   * @param mode El modo de vista a cambiar.
   */
  async changeView(mode: 'activos' | 'deshabilitados') {
    if (this.vista_modo2 === mode) {
      return;
    }
    this.vista_modo2 = mode;
    await this.reloadUsers();
    setTimeout(() => {
      this.initDataTables();
      this.setupButtonEvents();
    }, 0);
  }

  /**
   * Deshabilita un usuario a través del servicio API.
   * @param id El ID del usuario a deshabilitar.
   */
  async disableUser(id: string) {
    try {
      await this.userService.updateUser(id, { status: false });
      this.openAlertModal('Usuario desactivado con éxito.', 'success');
      await this.reloadUsers();
    } catch (error: any) {
      console.error('Error al desactivar usuario:', error);
      this.openAlertModal(`Error al desactivar usuario: ${error.message || 'Error desconocido'}`, 'error');
    } finally {
      this.closeConfirmModal();
    }
  }

  /**
   * Habilita un usuario a través del servicio API.
   * @param id El ID del usuario a habilitar.
   */
  async enableUser(id: string) {
    try {
      await this.userService.updateUser(id, { status: true });
      this.openAlertModal('Usuario habilitado con éxito.', 'success');
      await this.reloadUsers();
    } catch (error: any) {
      console.error('Error al habilitar usuario:', error);
      this.openAlertModal(`Error al habilitar usuario: ${error.message || 'Error desconocido'}`, 'error');
    } finally {
      this.closeConfirmModal();
    }
  }

  /**
   * Muestra los detalles de un usuario en un modal.
   * @param user El objeto de usuario cuyos detalles se van a mostrar.
   */
  verDetalles(user: any) {
    this.usuarioSeleccionado = user;
    this.showUserDetailsModal = true;
  }

  /**
   * Cierra el modal de detalles del usuario.
   */
  closeUserDetailsModal() {
    this.showUserDetailsModal = false;
    this.usuarioSeleccionado = null;
  }

  // --- Métodos para Modales de Confirmación y Alerta (personalizados sin Bootstrap JS) ---

  /**
   * Abre el modal de confirmación con un mensaje y una acción.
   * @param message El mensaje a mostrar en el modal de confirmación.
   * @param action La función asíncrona a ejecutar si el usuario confirma.
   */
  openConfirmModal(message: string, action: () => Promise<void>) {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  /**
   * Cierra el modal de confirmación.
   */
  closeConfirmModal() {
    this.showConfirmModal = false;
    this.confirmAction = null;
  }

  /**
   * Ejecuta la acción de confirmación y cierra el modal.
   */
  async executeConfirmAction() {
    if (this.confirmAction) {
      await this.confirmAction();
    }
    this.closeConfirmModal(); // Asegura que se cierra el modal después de la acción
  }

  /**
   * Abre el modal de alerta con un mensaje y tipo.
   * @param message El mensaje a mostrar.
   * @param type El tipo de alerta ('success', 'error', 'info').
   */
  openAlertModal(message: string, type: 'success' | 'error' | 'info') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlertModal = true;
  }

  /**
   * Cierra el modal de alerta.
   */
  closeAlertModal() {
    this.showAlertModal = false;
  }



  // MODULO DE FUENTES y COLORES

  saveMode: string = 'guardar';
  isLoading: boolean = false;
  error: any = null;
  savedStylesColor: any[] = [];
  savedStylesFont: any[] = [];
  activeTab: string = 'colors';
  editingItem: any = null;
  editMode: boolean = false;
  vista_modo: 'colores' | 'letras' | 'usuarios' = 'colores';

  //Valores de colores defectos
  headerBgColor: string = '#3498db';
  titleColor: string = '#ffffff';
  divBorderColor: string = '#95a5a6';
  footerBgColor: string = '#2c3e50';
  cardBgColor: string = '#ecf0f1';

  // Variables para tamaños de fuente
  titleFontSize: number = 32;
  subtitleFontSize: number = 24;
  textFontSize: number = 16;

  // Propiedades para manejo de fuentes
  fontName: string = '';
  isFontLoaded: boolean = false;
  customPreviewText: string = 'Texto de prueba';
  previewText: string = this.customPreviewText;
  fontURL: string = '';
  
  // Estilos por defecto
  defaultStyles = {
    primary_color: "#3498db",
    secondary_color: "#ffffff",
    tertiary_color: "#95a5a6",
    dark_color: "#2c3e50",
    ligth_color: "#ecf0f1",
    titleSize: 32,
    textSize: 16,
    subtitleSize: 24
  };

  styleCounter: number = 0;
  fontStyleCounter: number = 1;

  private applyStylesImmediately(): void {
    // Actualiza las variables CSS en el root
    document.documentElement.style.setProperty('--primary-color', this.headerBgColor);
    document.documentElement.style.setProperty('--secondary-color', this.titleColor);
    document.documentElement.style.setProperty('--tertiary-color', this.divBorderColor);
    document.documentElement.style.setProperty('--ligth-color', this.cardBgColor);
    document.documentElement.style.setProperty('--dark-color', this.footerBgColor);
    
    // Guarda en localStorage
    localStorage.setItem('CurrentStyles', JSON.stringify({
      color_one: this.headerBgColor,
      color_two: this.titleColor,
      color_three: this.divBorderColor,
      color_four: this.cardBgColor,
      color_five: this.footerBgColor,
      titleSize: this.titleFontSize,
      subtitleSize: this.subtitleFontSize,
      textSize: this.textFontSize
    }));
  }

  applyFontStyle(font: any): void {
    // Implementa la lógica para aplicar el estilo de fuente
    this.fontName = font.name;
    this.previewText = this.customPreviewText;
    this.isFontLoaded = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.name.endsWith(".ttf")) {
        this.fontName = "UserFont";
        this.fontURL = URL.createObjectURL(file);
        this.isFontLoaded = true;
      }
    }
  }

  updatePreview(): void {
    this.previewText = this.customPreviewText;
  }

  applyFont(): void {
    // Implementa la lógica para aplicar la fuente al documento
    if (this.fontName && this.fontURL) {
      const style = document.createElement('style');
      style.innerHTML = `
        @font-face {
          font-family: '${this.fontName}';
          src: url('${this.fontURL}') format('truetype');
        }
      `;
      document.head.appendChild(style);
    }
  }

  resetFont(): void {
    this.fontName = '';
    this.fontURL = '';
    this.isFontLoaded = false;
    this.customPreviewText = 'Texto de prueba';
    this.previewText = this.customPreviewText;
  }

  private loadInitialStyles(): void {
    const saved = localStorage.getItem('CurrentStyles');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.headerBgColor = parsed.color_one;
      this.titleColor = parsed.color_two;
      this.divBorderColor = parsed.color_three;
      this.cardBgColor = parsed.color_four;
      this.footerBgColor = parsed.color_five;
      this.titleFontSize = parsed.titleSize || 32;
      this.subtitleFontSize = parsed.subtitleSize || 24;
      this.textFontSize = parsed.textSize || 16;
    } else {
      this.applyDefaultStyles();
    }
  }

  private applyDefaultStyles(): void {
    this.headerBgColor = this.defaultStyles.primary_color;
    this.titleColor = this.defaultStyles.secondary_color;
    this.divBorderColor = this.defaultStyles.tertiary_color;
    this.cardBgColor = this.defaultStyles.ligth_color;
    this.footerBgColor = this.defaultStyles.dark_color;
    this.titleFontSize = this.defaultStyles.titleSize;
    this.subtitleFontSize = this.defaultStyles.subtitleSize;
    this.textFontSize = this.defaultStyles.textSize;
  }

  private applyStylesToElements(): void {
    // Los estilos se aplican automáticamente mediante property binding en el template
    // También actualizamos las variables CSS
    document.documentElement.style.setProperty('--primary-color', this.headerBgColor);
    document.documentElement.style.setProperty('--secondary-color', this.titleColor);
    document.documentElement.style.setProperty('--tertiary-color', this.divBorderColor);
    document.documentElement.style.setProperty('--ligth-color', this.cardBgColor);
    document.documentElement.style.setProperty('--dark-color', this.footerBgColor);
  }

  async fetchSavedStyles(): Promise<void> {
    try {
      const response = await this.colorFontService.getStyles();
      if (response) {
        this.savedStylesColor = response.colors;
        this.styleCounter = response.colors.length + 1;
      }
    } catch (error) {
      console.error("Error al obtener los estilos guardados:", error);
    }
  }

  async fetchSavedStylesFont(): Promise<void> {
    try {
      const response = await this.colorFontService.getFontStyles();
      if (response) {
        this.savedStylesFont = response.fonts;
      }
    } catch (error) {
      console.error("Error al obtener las fuentes guardadas:", error);
    }
  }

  handleSaveOrEdit(): void {
    if (this.saveMode === 'guardar') {
      this.saveCurrentStyle();
    } else {
      // Pasar el editingItem actual al método de edición
      if (this.editingItem) {
        this.handleSaveEdit(this.editingItem);
      } else {
        console.error('No hay elemento seleccionado para editar');
        Swal.fire({
          title: 'Error',
          text: 'No se ha seleccionado ninguna paleta para editar',
          icon: 'error'
        });
      }
    }
  }

  saveCurrentStyle(): void {
    Swal.fire({
      title: "¿Guardar paleta?",
      text: "¿Quieres guardar esta paleta en la base de datos?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newStyle = {
          moduleColor: {
            name: `Paleta: ${this.styleCounter}`,
            colors: {
              color_one: this.headerBgColor,
              color_two: this.titleColor,
              color_three: this.divBorderColor,
              color_four: this.cardBgColor,
              color_five: this.footerBgColor
            }
          },
        };

        try {
          await this.colorFontService.createStyles(newStyle);
          this.styleCounter++;
          this.fontStyleCounter++;

          Swal.fire({
            title: "¡Guardado!",
            text: "La paleta ha sido guardada.",
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });
          this.fetchSavedStyles();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo guardar la paleta.",
            icon: "error"
          });
        }
      }
    });
  }

  resetStyles(): void {
    Swal.fire({
      title: "¿Restablecer estilos?",
      text: "¿Quieres restablecer los estilos a los valores por defecto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, restablecer",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.applyDefaultStyles();
        this.applyStylesImmediately();
        localStorage.removeItem('CurrentStyles');
        Swal.fire({
          title: "¡Estilos restablecidos!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  }

  applyColorPalette(palette: any): void {
    Swal.fire({
      title: "¿Aplicar esta paleta?",
      text: "¿Quieres aplicar estos colores a la interfaz?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aplicar",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.headerBgColor = palette.colors.color_one;
        this.titleColor = palette.colors.color_two;
        this.divBorderColor = palette.colors.color_three;
        this.cardBgColor = palette.colors.color_four;
        this.footerBgColor = palette.colors.color_five;

        const newStyles = {
          color_one : palette.colors.color_one,
          color_two : palette.colors.color_two,
          color_three : palette.colors.color_three,
          color_four : palette.colors.color_four,
          color_five : palette.colors.color_five
        }

        this.styleManager.updateStyles(newStyles);

        this.applyStylesImmediately(); // Aplica los cambios inmediatamente

        Swal.fire({
          title: "¡Paleta aplicada!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  }

  async handleDeletePalette(colors_id: string): Promise<void> {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.colorFontService.deleteColors(colors_id);
          this.styleCounter--;
          this.fetchSavedStyles();
          Swal.fire({
            title: "¡Eliminado!",
            text: "La paleta de colores ha sido eliminada.",
            icon: "success"
          });
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la paleta.",
            icon: "error"
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelado",
          text: "Tu paleta está a salvo :)",
          icon: "error"
        });
      }
    });
  }

  async handleDeleteFontStyle(font_id: string): Promise<void> {
    if (!window.confirm('¿Estás seguro de eliminar esta fuente?')) return;
    try {
      await this.colorFontService.deleteFonts(font_id);
      this.fontStyleCounter--;
      this.fetchSavedStylesFont();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }

  handleEdit(item: any, type: string): void {
    this.editingItem = item;
    this.editMode = true;
    this.saveMode = 'editar';
    
    if (type === 'color') {
      this.headerBgColor = item.colors.color_one;
      this.titleColor = item.colors.color_two;
      this.divBorderColor = item.colors.color_three;
      this.cardBgColor = item.colors.color_four;
      this.footerBgColor = item.colors.color_five;
    } else {
      this.titleFontSize = item.title;
      this.subtitleFontSize = item.sub_title;
      this.textFontSize = item.paragraph;
    }
  }

  async handleSaveEdit(item: any): Promise<void> {

    console.log('handleSaveEdit called with item:', item);
    if (!item) {
      console.error('Item indefinido en handleSaveEdit');
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",    
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar!",
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (item.colors_id) {
            const colors = {
              color_one: this.headerBgColor,
              color_two: this.titleColor,
              color_three: this.divBorderColor,
              color_four: this.cardBgColor,
              color_five: this.footerBgColor
            };
            
            // Actualiza en el backend
            await this.colorFontService.updateColor(item.colors_id, colors);

            // Actualiza en el frontend
            this.savedStylesColor = this.savedStylesColor.map(c =>
              c.colors_id === item.colors_id ? { 
                ...c, 
                colors,
                name: `Paleta: ${item.colors_id}` 
              } : c
            );
            
            Swal.fire({
              title: "¡Paleta Editada!",
              icon: "success"
            });
          } else {
            // Lógica para fuentes (similar)
            const fontStyles = {
              title: this.titleFontSize,
              sub_title: this.subtitleFontSize,
              paragraph: this.textFontSize
            };

            await this.colorFontService.updateFont(item.font_id, fontStyles);

            this.savedStylesFont = this.savedStylesFont.map(f =>
              f.font_id === item.font_id ? { ...f, ...fontStyles } : f
            );
          }

          this.editMode = false;
          this.editingItem = null;
          this.saveMode = 'guardar';
          
          // No necesitamos incrementar los contadores en edición
          this.fetchSavedStyles(); // Refrescar la lista
          
        } catch (error) {
          console.error("Error al actualizar:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la paleta",
            icon: "error"
          });
        }
      }
    });
  }
}
