<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false displayMessage=true; section>
  <div class="kc-logout-container">
  <img src="${url.resourcesPath}/css/logo.png" alt="Logo" class="logo" />
    <h1>Are you sure you want to log out?</h1>
    <form class="logout-form" action="${url.logoutConfirmAction}" method="POST">
      <input type="submit" value="Logout" />
    </form>
    <a href="http://localhost:3000/" class="kc-home-button">Return to Home</a>
  </div>
</@layout.registrationLayout>
