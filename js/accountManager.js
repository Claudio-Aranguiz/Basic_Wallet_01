/**
 * accountManager.js - Gestión de datos de cuenta y activación
 */

class AccountManager {
   constructor() {
      this.currentUser = null;
      this.init();
   }

   async init() {
      if (window.sessionManager) {
         await window.sessionManager.readyPromise;
         this.currentUser = window.sessionManager.getCurrentUser();
         if (this.currentUser) {
            this.setupEventListeners();
         }
      }
   }

   setupEventListeners() {
      const btnConfig = document.getElementById('btnConfigAccount');
      const btnSave = document.getElementById('btnSaveAccountData');
      const btnActivate = document.getElementById('btnActivateBonus');

      if (btnConfig) btnConfig.addEventListener('click', () => this.openModal());
      if (btnSave) btnSave.addEventListener('click', () => this.saveData());
      if (btnActivate) btnActivate.addEventListener('click', () => this.activateWithBonus());
   }

   openModal() {
      this.currentUser = window.sessionManager.getCurrentUser();

      const inputAcc = document.getElementById('displayAccNumber');
      const inputAlias = document.getElementById('inputAlias');
      const inputBank = document.getElementById('inputBank');
      const activationBadge = document.getElementById('activationBadge');
      const activationSection = document.getElementById('activationSection');

      if (inputAcc) inputAcc.value = this.currentUser.accountNumber || '---';
      if (inputAlias) inputAlias.value = this.currentUser.alias || '';
      if (inputBank) inputBank.value = this.currentUser.bank || 'AlkeWallet';

      const isVerified = this.currentUser.isVerified === true;
      if (!isVerified) {
         activationBadge?.classList.remove('d-none');
         activationSection?.classList.remove('d-none');
      } else {
         activationBadge?.classList.add('d-none');
         activationSection?.classList.add('d-none');
      }

      $('#accountConfigModal').modal('show');
   }

   saveData() {
      const alias = document.getElementById('inputAlias').value.trim();
      const bank = document.getElementById('inputBank').value.trim();

      this.currentUser.alias = alias;
      this.currentUser.bank = bank || 'AlkeWallet';

      window.sessionManager.saveUserSession();

      if (window.DATABASE) {
         const userIdx = window.DATABASE.users.findIndex(u => u.email === this.currentUser.email);
         if (userIdx !== -1) {
            window.DATABASE.users[userIdx].alias = alias;
            window.DATABASE.users[userIdx].bank = bank;
         }
      }

      if (typeof showNotification === 'function') {
         showNotification('Datos de cuenta actualizados correctamente', 'success', 'Perfil Actualizado');
      }

      $('#accountConfigModal').modal('hide');
   }

   activateWithBonus() {
      const BONUS_AMOUNT = 10000;

      if (this.currentUser.isVerified) {
         if (typeof showNotification === 'function') {
            showNotification('Tu cuenta ya está activa', 'info');
         }
         return;
      }

      this.currentUser.balance += BONUS_AMOUNT;
      this.currentUser.isVerified = true;

      if (window.transactionManager) {
         window.transactionManager.addTransaction({
            userId: this.currentUser.email,
            type: 'deposit',
            description: 'Bono de Bienvenida - Activación de Cuenta',
            amount: BONUS_AMOUNT,
            status: 'completed'
         });
      }

      window.sessionManager.saveUserSession();

      if (window.menuManager) {
         window.menuManager.updateBalanceDisplay();
      }

      if (typeof showNotification === 'function') {
         const formattedBonus = window.sessionManager.formatCurrency(BONUS_AMOUNT);
         showNotification(`¡Felicidades! Has recibido un bono de ${formattedBonus} por activar tu cuenta.`, 'success', 'Cuenta Activada 🚀');
      }

      $('#accountConfigModal').modal('hide');
   }
}

document.addEventListener('DOMContentLoaded', () => {
   window.accountManager = new AccountManager();
});
