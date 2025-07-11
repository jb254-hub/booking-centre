const BASE_URL = 'https://booking-centre.onrender.com';
    const answerOptions = {
      color: ['Red','Blue','Green','Yellow'],
      sport: ['Football','Basketball','Tennis','Cricket'],
      pet: ['Dog','Cat','Parrot','Fish']
    };

    function isValidMobile(input) {
      return /^\d{10}$/.test(input);
    }
    function isValidEmail(input) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    }
    function sanitize(input) {
      return input.replace(/[<>'";]/g, '');
    }
    function isValidUser(input) {
      return isValidMobile(input) || isValidEmail(input);
    }

    function switchForm(formId) {
      ['loginForm','registerForm','forgotForm'].forEach(id => {
        document.getElementById(id).classList.toggle('hidden', formId!==id);
      });
      ['loginTab','registerTab','forgotTab'].forEach(id => {
        document.getElementById(id).classList.toggle('active', formId.includes(id.replace('Tab','')));
      });
      document.querySelectorAll('.message').forEach(el => el.textContent='');
      document.querySelectorAll('form input').forEach(i=>i.value='');
      document.querySelectorAll('form select').forEach(s=>s.selectedIndex=0);
      if (document.getElementById('termsCheckbox')) document.getElementById('termsCheckbox').checked=false;
      document.getElementById('recoverySection').classList.add('hidden');
      document.getElementById('recoveryQuestionText').textContent='';
    }

    // Password toggle functionality
    function setupPasswordToggle(toggleId, inputId) {
      const toggle = document.getElementById(toggleId);
      const input = document.getElementById(inputId);
      toggle.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');
      });
    }

    // Initialize password toggles
    setupPasswordToggle('toggleLoginPass', 'loginPass');
    setupPasswordToggle('toggleRegPass', 'regPass');
    setupPasswordToggle('toggleNewPass', 'newPassword');

    document.getElementById('regQuestion').onchange = e => {
      const opt = answerOptions[e.target.value] || [];
      const sel = document.getElementById('regAnswer');
      sel.innerHTML = '<option value="">Select Answer</option>';
      opt.forEach(o=>sel.add(new Option(o,o)));
    };

    document.getElementById('loginTab').onclick = () => switchForm('loginForm');
    document.getElementById('registerTab').onclick = () => switchForm('registerForm');
    document.getElementById('forgotTab').onclick = () => switchForm('forgotForm');

    document.getElementById('registerForm').onsubmit = async e => {
      e.preventDefault();
      let user = sanitize(document.getElementById('regUser').value.trim().toLowerCase());
      const pass = sanitize(document.getElementById('regPass').value);
      const question = document.getElementById('regQuestion').value;
      const answer = document.getElementById('regAnswer').value;
      const terms = document.getElementById('termsCheckbox').checked;
      const msg = document.getElementById('regMsg');

      if (!user||!pass||!question||!answer) {
        msg.textContent='Please fill all fields.'; 
        msg.className = 'message error';
        return;
      }
      if (!isValidUser(user)) {
        msg.textContent='Enter valid 10-digit mobile number or email.'; 
        msg.className = 'message error';
        return;
      }
      if (!terms) {
        msg.textContent='You must agree to the Terms and Conditions.'; 
        msg.className = 'message error';
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/register`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:'include',
          body:JSON.stringify({user,pass,question,answer})
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent='Registered successfully! Redirecting...';
          msg.className = 'message success';
          setTimeout(()=>window.location.href='/bookingcentre.site/',1500);
        } else {
          msg.textContent=data.error||'Registration failed';
          msg.className = 'message error';
        }
      } catch {
        msg.textContent='Server error';
        msg.className = 'message error';
      }
    };

    document.getElementById('loginForm').onsubmit = async e => {
      e.preventDefault();
      let user = sanitize(document.getElementById('loginUser').value.trim().toLowerCase());
      const pass = sanitize(document.getElementById('loginPass').value);
      const msg = document.getElementById('loginMsg');

      if (!user||!pass) {
        msg.textContent='Please fill all fields.'; 
        msg.className = 'message error';
        return;
      }
      if (!isValidUser(user)) {
        msg.textContent='Enter valid 10-digit mobile number or email.'; 
        msg.className = 'message error';
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/login`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:'include',
          body:JSON.stringify({user,pass})
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent='Login successful! Redirecting...';
          msg.className = 'message success';
          setTimeout(()=>window.location.href='/bookingcentre.site',1500);
        } else {
          msg.textContent=data.error||'Login failed';
          msg.className = 'message error';
        }
      } catch {
        msg.textContent='Server error';
        msg.className = 'message error';
      }
    };

    document.getElementById('getQuestion').onclick = async () => {
      let user = sanitize(document.getElementById('forgotUser').value.trim().toLowerCase());
      const msg = document.getElementById('forgotMsg');
      const qText = document.getElementById('recoveryQuestionText');
      const sel = document.getElementById('recoveryAnswer');

      if (!isValidUser(user)) {
        msg.textContent='Enter valid 10-digit mobile number or email.'; 
        msg.className = 'message error';
        qText.textContent=''; 
        document.getElementById('recoverySection').classList.add('hidden');
        return;
      }
      msg.textContent='';

      try {
        const res = await fetch(`${BASE_URL}/api/recover-question?user=${encodeURIComponent(user)}`,{credentials:'include'});
        const data = await res.json();
        if (data.success) {
          qText.textContent = data.question || '';
          sel.innerHTML = '<option value="">Select Answer</option>';
          (answerOptions[data.question]||[]).forEach(o=>sel.add(new Option(o,o)));
          document.getElementById('recoverySection').classList.remove('hidden');
          document.getElementById('newPassword').style.display = 'none';
          document.getElementById('resetBtn').style.display = 'none';
          msg.textContent='';
        } else {
          msg.textContent = data.error||'User not found.';
          msg.className = 'message error';
          qText.textContent=''; 
          document.getElementById('recoverySection').classList.add('hidden');
        }
      } catch {
        msg.textContent='Server error';
        msg.className = 'message error';
        qText.textContent=''; 
        document.getElementById('recoverySection').classList.add('hidden');
      }
    };

    document.getElementById('recoveryAnswer').onchange = async () => {
      let user = sanitize(document.getElementById('forgotUser').value.trim().toLowerCase());
      const answer = document.getElementById('recoveryAnswer').value;
      const msg = document.getElementById('forgotMsg');
      const newPwd = document.getElementById('newPassword');
      const btn = document.getElementById('resetBtn');

      if (!user || !answer) return;

      try {
        const res = await fetch(`${BASE_URL}/api/verify-answer`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:'include',
          body:JSON.stringify({user,answer})
        });
        const data = await res.json();
        if (data.success) {
          newPwd.style.display='block'; 
          btn.style.display='block';
          msg.textContent='';
        } else {
          newPwd.style.display='none'; 
          btn.style.display='none';
          msg.textContent=data.error||'Incorrect answer.';
          msg.className = 'message error';
        }
      } catch {
        newPwd.style.display='none'; 
        btn.style.display='none';
        msg.textContent='Server error';
        msg.className = 'message error';
      }
    };

    document.getElementById('forgotForm').onsubmit = async e => {
      e.preventDefault();
      let user = sanitize(document.getElementById('forgotUser').value.trim().toLowerCase());
      const newPass = sanitize(document.getElementById('newPassword').value);
      const msg = document.getElementById('forgotMsg');

      if (!newPass) {
        msg.textContent='Please enter a new password.'; 
        msg.className = 'message error';
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/reset-password`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:'include',
          body:JSON.stringify({user,newPass})
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent='Password reset successful! You can now login.'; 
          msg.className = 'message success';
          setTimeout(() => switchForm('loginForm'), 2000);
        } else {
          msg.textContent=data.error||'Password reset failed.'; 
          msg.className = 'message error';
        }
      } catch {
        msg.textContent='Server error'; 
        msg.className = 'message error';
      }
    };

    // Initialize with login form
    switchForm('loginForm');


  

    document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


document.addEventListener('keydown', function (e) {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
        alert("Action disabled");
    }
});
