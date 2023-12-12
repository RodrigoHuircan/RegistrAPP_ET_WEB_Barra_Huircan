export interface UsuarioI{
    fullname: string,
    email: string,
    password: string,
    uid: string,
    usuario: string,
    asignaturas: string[];
    //perfil: 'docente' | 'alumno',
} 

export interface CodigoQRI {
    asignaturaSala: string;
    fechaHora: string;
    estudiante: string;
}