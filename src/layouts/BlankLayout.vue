<template>
  <div class="blank-layout">
    <div class="background-overlay"></div>
    <div class="auth-container">
      <div class="brand-section">
        <div class="logo">
          <h1>사주나라</h1>
          <p class="tagline">운명을 읽는 지혜</p>
        </div>
      </div>

      <div class="content-section">
        <router-view />
      </div>
    </div>

    <!-- 장식용 요소들 -->
    <div class="decorative-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlankLayout'
}
</script>

<style scoped>
.blank-layout {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  animation: backgroundShift 20s ease-in-out infinite;
}

@keyframes backgroundShift {

  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 0.8;
  }
}

.auth-container {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 500px;
  max-width: 900px;
  width: 90%;
  position: relative;
  z-index: 10;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)" /></svg>');
  opacity: 0.3;
}

.logo {
  text-align: center;
  position: relative;
  z-index: 1;
}

.logo h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tagline {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.content-section {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 400px;
}

.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 120px;
  height: 120px;
  top: 70%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  top: 30%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.5;
  }

  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.8;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    min-height: auto;
    max-width: 400px;
  }

  .brand-section {
    padding: 40px 20px;
  }

  .logo h1 {
    font-size: 2.5rem;
  }

  .content-section {
    min-width: auto;
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    margin: 20px;
    width: calc(100% - 40px);
  }

  .logo h1 {
    font-size: 2rem;
  }

  .tagline {
    font-size: 1rem;
  }

  .brand-section,
  .content-section {
    padding: 30px 20px;
  }
}

/* 실제 로그인 폼 스타일링 */
:deep(.login-container) {
  width: 100%;
  max-width: 400px;
}

:deep(.login-title) {
  font-size: 1.8rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 600;
}

:deep(.login-subtitle) {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(.form-group) {
  margin-bottom: 20px;
  position: relative;
}

:deep(.form-label) {
  display: block;
  font-size: 0.9rem;
  color: #5a6c7d;
  margin-bottom: 8px;
  font-weight: 500;
}

:deep(.form-input) {
  width: 100%;
  padding: 15px 20px;
  padding-left: 45px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

:deep(.form-input:focus) {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

:deep(.input-icon) {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #bdc3c7;
  font-size: 18px;
}

:deep(.form-group:has(.form-input:focus) .input-icon) {
  color: #3498db;
}

:deep(.checkbox-wrapper) {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

:deep(.checkbox) {
  margin-right: 8px;
}

:deep(.checkbox-label) {
  font-size: 0.9rem;
  color: #5a6c7d;
  user-select: none;
  cursor: pointer;
}

:deep(.login-button) {
  width: 100%;
  background: linear-gradient(135deg, #6c7ae0 0%, #9b59b6 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

:deep(.login-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 122, 224, 0.3);
}

:deep(.login-button:active) {
  transform: translateY(0);
}

:deep(.forgot-password) {
  text-align: center;
}

:deep(.forgot-password a) {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

:deep(.forgot-password a:hover) {
  color: #2980b9;
  text-decoration: underline;
}
</style>
