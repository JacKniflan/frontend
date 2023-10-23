import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Persona } from 'src/app/interfaces/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { AgregarEditarPersonaComponent } from '../agregar-editar-persona/agregar-editar-persona.component';


@Component({
  selector: 'app-list-personas',
  templateUrl: './list-personas.component.html',
  styleUrls: ['./list-personas.component.css']
})

// Clase para listar personas y eliminarlas 
export class ListPersonasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'correo', 'tipoDocumento', 'documento', 'fechaNacimiento', 'acciones'];
  dataSource: MatTableDataSource<Persona>;
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inyectamos el servicio de persona y el dialog para abrir el modal de agregar y editar personas
  constructor(public dialog: MatDialog, private _personaService: PersonaService,
    private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.obtenerPersonas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Obtenemos las personas y las seteamos en el dataSource para mostrarlas en la tabla 
  obtenerPersonas() {
    this.loading = true;

    this._personaService.getPersonas().subscribe(data => {
      this.loading = false;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }
  // Filtramos las personas por nombre, apellido y correo electronico   
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Abrimos el modal de agregar y editar personas y le pasamos el id si es que existe
  addEditPersona(id?: number) {
    const dialogRef = this.dialog.open(AgregarEditarPersonaComponent, {
      width: '550px',
      disableClose: true,
      data: { id: id }
    });

    // Actualizamos la tabla cuando se cierra el modal
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result) {
          this.obtenerPersonas();
        }
      }
    });
  }
  // Eliminamos la persona por el id y mostramos un mensaje de exito
  deletePersona(id: number) {
    this.loading = true;

    setTimeout(() => {
      this._personaService.deletePersona(id).subscribe(() => {
        this.obtenerPersonas();
        this.mensajeExito();
      })
    }, 1000);
  }

  mensajeExito() {
    this._snackBar.open('La persona fue eliminada con exito', '', {
      duration: 2000
    });
  }

}
