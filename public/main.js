document.addEventListener("DOMContentLoaded", function () {
    const navbarMenu = document.getElementById("navbarMenu");
  
    if (window.location.pathname === '/Register' || window.location.pathname === '/login') {
      navbarMenu.innerHTML = `
        <div>
          <button onclick="window.location.href='/Register'">Register</button>
          <button onclick="window.location.href='/login'">Login</button>
        </div>
      `;
    } else {
      navbarMenu.innerHTML = `
        <div>
          <button onclick="window.location.href='/call'">
            <i class="fa fa-phone"></i>
          </button>
          <button onclick="window.location.href='/messages'">
            <i class="fas fa-envelope"></i>
          </button>
          <button onclick="window.location.href='/Calendar'">
            <i class="far fa-calendar-alt"></i>
          </button>
          <button onclick="window.location.href='/Search'">
            <i class="fas fa-search"></i>
          </button>
          <button onclick="window.location.href='/'">
            <i class="fas fa-user"></i>
          </button>
          <button onclick="window.location.href='/Notifications'">
            <i class="fas fa-bell"></i>
          </button>
        </div>
      `;
    }
  });
