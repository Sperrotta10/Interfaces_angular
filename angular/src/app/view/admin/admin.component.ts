import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService2 } from "../../../services/proyect2/api.service";

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

  @ViewChild('activeTable') activeTable!: ElementRef;
  @ViewChild('disabledTable') disabledTable!: ElementRef;

  usersActive: any[] = [];
  usersDesactive: any[] = [];
  vista_modo2: 'activos' | 'deshabilitados' = 'activos';

  usuarioSeleccionado: any = null; // Para el modal de detalles

  activeDataTable: any;
  disabledDataTable: any;

  // Variables para modales personalizados (sin Bootstrap JS)
  showUserDetailsModal: boolean = false; // Controla la visibilidad del modal de detalles
  showConfirmModal: boolean = false;
  confirmAction: (() => Promise<void>) | null = null;
  confirmMessage: string = '';

  showAlertModal: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private userService: ApiService2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
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
    // Este método se ejecutará DESPUÉS de ngOnInit y cuando la vista esté inicializada.
    // Como ya llamamos a initDataTables en ngOnInit después de reloadUsers,
    // este método podría ser más para configuraciones adicionales que requieran
    // que los ViewChilds estén definitivamente listos.
    // Para la inicialización de DataTables, ngOnInit con setTimeout(0) es más robusto
    // porque se ejecuta después de la carga asíncrona de datos.
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


  //Valores de colores defectos
  headerBgColor = '#3498db';
  titleColor = '#ffffff';
  divBorderColor = '#95a5a6';
  footerBgColor = '#2c3e50';
  cardBgColor = '#ecf0f1';

  titleFontSize = 36;
  

  //cambia modo de vista
  vista_modo: 'colores' | 'letras' | 'usuarios' = 'colores';


  @ViewChild('fontPreview') fontPreview!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  fontName: string = '';
  fontUrl: string | null = null;
  previewText: string = 'OMG, nuevo estilo bang bang bang!';
  customPreviewText: string = '';
  isFontLoaded: boolean = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && (file.type === 'font/ttf' || file?.name.endsWith('.ttf'))) {
      this.fontName = file.name.replace('.ttf', '');
      this.createFontUrl(file);
    } else {
      alert('Por favor sube archivo valido (ttf)');
    }
  }

  private createFontUrl(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      this.fontUrl = URL.createObjectURL(file);
      this.loadFont();
    };
    
    reader.readAsArrayBuffer(file);
  }

  private loadFont(): void {
    if (!this.fontUrl || !this.fontName) return;

    const fontFace = new FontFace(this.fontName, `url(${this.fontUrl})`);
    
    fontFace.load().then((loadedFace) => {
      
      if ('fonts' in document) {
        
        (document.fonts as any).add(loadedFace);
      } else {
        // Si anterior el codigo no se funciona, se usara esta
        this.injectFontStyle(loadedFace);
      }
      
      this.isFontLoaded = true;
      this.updatePreview();
    }).catch(err => {
      console.error('Falla de carga ttf:', err);
      alert('Falla de carga ttf, por favor buscar otro archivo de ttf');
    });
  }

  private injectFontStyle(fontFace: FontFace): void {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFace.family}';
        src: url(${this.fontUrl}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  updatePreview(): void {
    if (this.customPreviewText) {
      this.previewText = this.customPreviewText;
    }
    
    if (this.fontName && this.fontPreview) {
      this.fontPreview.nativeElement.style.fontFamily = this.fontName;
    }
  }

  applyFont(): void {
    if (!this.fontName) return;
    
    // Aqui es un ejemplo para ver como se aplica el cambio de estilos
    document.body.style.fontFamily = `'${this.fontName}', sans-serif`;
  }

  resetFont(): void {
    this.fontUrl = null;
    this.fontName = '';
    this.isFontLoaded = false;
    this.fileInput.nativeElement.value = '';
    if (this.fontPreview) {
      this.fontPreview.nativeElement.style.fontFamily = '';
    }
    if (this.fontUrl) {
      URL.revokeObjectURL(this.fontUrl);
    }
  }
}
