import Course from '../courses/course.model.js';

export const crearCursoInformatica = async () => {
    const verifyCourse = await Course.findOne({ name: "informatica" })

    if (!verifyCourse) {

        const courseInformatica = new Course({
            name: "informatica",
            description: "Curso de Informatica",
        });
    
        await courseInformatica.save();
    
        console.log(" ");
        console.log("El Curso Informatica fue creado exitosamente!!");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El Curso Informatica ya existe, no se creó nuevamente");
        console.log(" ");
    }
}

export const crearCursoElectronica = async () => {
    const verifyCourse = await Course.findOne({ name: "electronica" })

    if (!verifyCourse) {

        const courseElectronica = new Course({
            name: "electronica",
            description: "Curso de Electronica",
        });
    
        await courseElectronica.save();
    
        console.log(" ");
        console.log("El Curso Electronica fue creado exitosamente!!");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El Curso Electronica ya existe, no se creó nuevamente");
        console.log(" ");
    }
}

export const crearCursoDibujo = async () => {
    const verifyCourse = await Course.findOne({ name: "dibujo" })

    if (!verifyCourse) {

        const courseDibujo = new Course({
            name: "dibujo",
            description: "Curso de Dibujo",
        });
    
        await courseDibujo.save();
    
        console.log(" ");
        console.log("El Curso Dibujo fue creado exitosamente!!");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El Curso Dibujo ya existe, no se creó nuevamente");
        console.log(" ");
    }
}