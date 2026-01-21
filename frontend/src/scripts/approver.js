function initializeNavigation() {
  const mobileMenuOpenBtn = document.getElementById('mobile-menu-open');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const bodyElement = document.body;

  function openMobileMenu() {
    mobileOverlay.classList.add('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    mobileMenuOpenBtn.setAttribute('aria-expanded', 'true');
    bodyElement.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    mobileMenuOpenBtn.setAttribute('aria-expanded', 'false');
    bodyElement.style.overflow = '';
  }

  mobileMenuOpenBtn.addEventListener('click', openMobileMenu);
  mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);

  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      closeMobileMenu();
    }
  });

  const mobileLinks = mobileOverlay.querySelectorAll('.navigation-mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  let lastScrollTop = 0;
  const navWrapper = document.getElementById('main-navigation');

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      navWrapper.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      navWrapper.style.padding = 'var(--spacing-xs) 0';
    } else {
      navWrapper.style.boxShadow = 'none';
      navWrapper.style.padding = 'var(--spacing-sm) 0';
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });
}

function approveRequest(button, employeeName) {
  const originalText = button.textContent;
  button.textContent = 'Processing...';
  button.disabled = true;

  setTimeout(() => {
    const row = button.closest('tr');
    row.style.opacity = '0.5';
    button.textContent = '✓ Approved';
    button.style.backgroundColor = 'var(--color-accent)';
    
    showNotification('Success', `Request from ${employeeName} has been approved!`, 'success');
    
    setTimeout(() => {
      row.style.display = 'none';
      updatePendingCount();
    }, 2000);
  }, 1000);
}

function rejectRequest(button) {
  const feedback = prompt('Please provide a reason for rejection:');
  if (feedback) {
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;

    setTimeout(() => {
      const row = button.closest('tr');
      row.style.opacity = '0.5';
      button.textContent = '✓ Rejected';
      button.style.backgroundColor = '#dc3545';
      
      showNotification('Request Rejected', 'Feedback has been sent to the employee.', 'info');
      
      setTimeout(() => {
        row.style.display = 'none';
        updatePendingCount();
      }, 2000);
    }, 1000);
  }
}

function updatePendingCount() {
  const visibleRows = document.querySelectorAll('.attendance-table tbody tr:not([style*="display: none"])');
  const badge = document.querySelector('.navigation-badge');
  if (badge) {
    badge.textContent = visibleRows.length;
  }
}

function showNotification(title, message, type = 'info') {
  const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#dc3545' : '#2196f3';
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">${title}</div>
    <div style="font-size: 14px; opacity: 0.95;">${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function initializeSignOut() {
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out?')) {
        this.textContent = 'Signing Out...';
        this.disabled = true;
        
        setTimeout(() => {
          window.location.href = './login.html';
        }, 1000);
      }
    });
  }
}

function initializeFilter() {
  const filterType = document.getElementById('filter-type');
  if (filterType) {
    filterType.addEventListener('change', function(e) {
      const filterValue = this.value;
      const tbody = document.querySelector('.attendance-table tbody');
      const rows = tbody.querySelectorAll('tr');

      rows.forEach(row => {
        if (!filterValue) {
          row.style.display = '';
        } else {
          const requestType = row.cells[1].textContent.toLowerCase();
          if (requestType.includes(filterValue)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  }
}

function initializeScrollReveal() {
  const revealElements = document.querySelectorAll('.feature-card, .support-card, .contact-card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease-out';
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeSignOut();
  initializeFilter();
  initializeScrollReveal();
});
