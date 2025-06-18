<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false displayMessage=false; section>
  <div class="kc-logout-container">
  <img src="${url.resourcesPath}/css/logo.png" alt="Logo" class="logo" />
    <h1>You are now logged out</h1>
    <a href="http://localhost:3000" class="kc-home-button">Return to Home</a>
  </div>
</@layout.registrationLayout>
