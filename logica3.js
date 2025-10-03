function verificarUsuario() {
            let usuario = document.getElementById("usuario").value;
            let contrasena = document.getElementById("contrasena").value;

            if (usuario === "" || contrasena === "") {
                alert("Por favor completa todos los campos");
                return;
            }

            if (usuario === "J Pablo" && contrasena === "1234") {
                localStorage.setItem("sesionCalculadora", "activa");
                document.getElementById("formulario-login").submit();
                window.location.href = "index.html"
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        }
