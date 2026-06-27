/* js/hero-slider.js — Hero slider with auto-advance, touch, keyboard */
function HeroSlider(container) {
  this.container = container;
  this.slides = container.querySelectorAll('.hero-slide');
  this.dots = container.querySelectorAll('.hero-dot');
  this.current = 0;
  this.timer = null;
  this.touchStartX = 0;
  this.touchEndX = 0;
  this.paused = false;
  if (this.slides.length === 0) return;
  this.init();
}

HeroSlider.prototype.init = function() {
  this.show(0);
  this.startAuto();
  this.bindDots();
  this.bindTouch();
  this.bindHover();
  this.bindKeyboard();
};

HeroSlider.prototype.show = function(idx) {
  if (idx < 0) idx = this.slides.length - 1;
  if (idx >= this.slides.length) idx = 0;
  this.current = idx;
  for (var i = 0; i < this.slides.length; i++) {
    this.slides[i].classList.remove('active');
    this.slides[i].style.opacity = '0';
    this.slides[i].style.transform = 'scale(1.05)';
  }
  for (var j = 0; j < this.dots.length; j++) {
    this.dots[j].classList.remove('active');
    this.dots[j].setAttribute('aria-selected', 'false');
  }
  this.slides[idx].classList.add('active');
  this.slides[idx].style.opacity = '1';
  this.slides[idx].style.transform = 'scale(1)';
  if (this.dots[idx]) {
    this.dots[idx].classList.add('active');
    this.dots[idx].setAttribute('aria-selected', 'true');
  }
};

HeroSlider.prototype.next = function() { this.show(this.current + 1); };
HeroSlider.prototype.prev = function() { this.show(this.current - 1); };

HeroSlider.prototype.startAuto = function() {
  var self = this;
  this.stopAuto();
  this.timer = setInterval(function() {
    if (!self.paused) self.next();
  }, 4000);
};

HeroSlider.prototype.stopAuto = function() {
  if (this.timer) { clearInterval(this.timer); this.timer = null; }
};

HeroSlider.prototype.bindDots = function() {
  var self = this;
  this.dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { self.show(i); self.startAuto(); });
    dot.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.show(i); self.startAuto(); }
    });
  });
};

HeroSlider.prototype.bindTouch = function() {
  var self = this;
  this.container.addEventListener('touchstart', function(e) {
    self.touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  this.container.addEventListener('touchend', function(e) {
    self.touchEndX = e.changedTouches[0].screenX;
    var diff = self.touchStartX - self.touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) self.next(); else self.prev();
      self.startAuto();
    }
  }, { passive: true });
};

HeroSlider.prototype.bindHover = function() {
  var self = this;
  this.container.addEventListener('mouseenter', function() { self.paused = true; });
  this.container.addEventListener('mouseleave', function() { self.paused = false; });
};

HeroSlider.prototype.bindKeyboard = function() {
  var self = this;
  this.container.setAttribute('tabindex', '0');
  this.container.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { self.prev(); self.startAuto(); }
    if (e.key === 'ArrowRight') { self.next(); self.startAuto(); }
  });
};