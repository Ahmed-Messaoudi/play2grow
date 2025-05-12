<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=true; section>
  <div class="kc-login-container">
    <h1>Welcome to Play2Grow</h1>
    <form id="kc-form-login" action="${url.loginAction}" method="post">
      <div>
        <input type="text" id="username" name="username" placeholder="Username" required />
      </div>
      <div>
        <input type="password" id="password" name="password" placeholder="Password" required />
      </div>
      <div>
        <input type="submit" value="Login" />
      </div>
      <#if realm.registrationAllowed?? && realm.registrationAllowed>
        <div class="create-account">
          <a href="${url.registrationUrl}" class="kc-registration">Create account</a>
        </div>
      </#if>
    </form>

    <!-- Return to home link -->
    <div class="return-home">
      <a href="http://localhost:3000/" class="kc-return-home-btn">← Return to Home</a>
    </div>
  </div>
</@layout.registrationLayout>
