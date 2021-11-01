// bloque1: URL base para las peticiones
const baseUrl = 'https://api.github.com/users';

// bloque2: Función request la que hará las peticiones a la API y retorna el resultado
const request = async (url) => {
    const results = await fetch(url);
    const response = await results.json();
    return response;
}

//bloque3: Función getUser
const getUser = async (user) => {
    const url = `${baseUrl}/${user}`
    return request(url);
}

//bloque4: Función getRepo
const getRepo = async (user, pagina, cantidad_repos) => {
    const url = `${baseUrl}/${user}/repos?page=${pagina}&per_page=${cantidad_repos}`;
    return request(url);
}

//bloque5: Formulario
let formulario = document.querySelector('form');

//se agrega una escucha (addEventListener) al formulario
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    let nombreUsuario = document.getElementById('nombre').value;
    let numeroPagina = document.getElementById('pagina').value;
    let repositorioPagina = document.getElementById('repoPagina').value

    //mediante promise.all se realiza el llamado a las dos funciones getUser y getRepo
    Promise.all([getUser(nombreUsuario), getRepo(nombreUsuario, numeroPagina, repositorioPagina)])
        .then(resp => {

            //bloque resultados
            let resultados = document.getElementById('resultados');
            if (resp[0].message == "Not Found") {

                resultados.innerHTML = '';
                
                 // crea error personalizado
                alert('ups!!, El usuario no existe, ingrese un nombre de usuario registrado');
            } else {
                let repos = '';
                resp[1].forEach(element => {
                    repos += `<p><a href="${element.html_url}" target="_blank">${element.name}</a></p>`;
                });

                resultados.innerHTML = `<div class="row mt-4">
                <div class="text-left col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <h3> Datos del Usuario</h3>
                    <div class="w-50">
                        <img src="${resp[0].avatar_url}" class="img-fluid">
                    </div>
                    <p>Nombre del usuario: ${resp[0].name}</p>
                    <p>Login del usuario: ${resp[0].login}</p>
                    <p>Cantidad de repositorios: ${resp[0].public_repos}</p>
                    <p>Localidad: ${resp[0].location}</p>
                    <p>Tipo de Usuario: ${resp[0].type}</p>
                </div>
                <div class="text-right col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <h3>Nombre de repositorios</h3>
                    ${repos}
                </div>
            </div>`;
            }

        })

        .catch(err => {
            console.error('err', err);
        })

 // Limpia los campos del formulario en cada evento submit
    document.getElementById('nombre').value = '';
    document.getElementById('pagina').value = '';
    document.getElementById('repoPagina').value = '';

})