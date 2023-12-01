const horizontalSections = gsap.utils.toArray('section.horizontal')

horizontalSections.forEach(function (sec, i) {  
  
  var thisPinWrap = sec.querySelector('.pin-wrap');
  var thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');
  
  var getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth); 

  gsap.fromTo(thisAnimWrap, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue() 
  }, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0, 
    ease: "none",
    scrollTrigger: {
      trigger: sec,   
      start: "top top",
      end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
      pin: thisPinWrap,
      invalidateOnRefresh: true,
      scrub: true,
    }
  });

}); 


const Scroll = function(input, input2, input3) {
  let sections;
  let page;
  let main;
  let scrollTrigger;
  let tl;
  let win;

  this.init = () => {
    sections = document.querySelectorAll(input);
    page = document.querySelector(input2);
    main = document.querySelector(input3);
    win = {
      w: window.innerWidth,
      h: window.innerHeight
    };

    this.setupTimeline();
    this.setupScrollTrigger();
    window.addEventListener('resize', this.onResize);
  };

  this.setupScrollTrigger = () => {
    page.style.height = (this.getTotalScroll() + win.h) + 'px';

    scrollTrigger = ScrollTrigger.create({
      id: 'mainScroll',
      trigger: input3,
      animation: tl,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const scrollPercent = self.progress * 100;
        const newHeight = win.h - (win.h * (scrollPercent / 100));
        main.style.height = `${newHeight}px`;
      },
      snap: {
        snapTo: (value) => {
          let labels = Object.values(tl.labels);
          const snapPoints = labels.map(x => x / tl.totalDuration());
          const proximity = 0.1;

          for (let i = 0; i < snapPoints.length; i++) {
            if (value > snapPoints[i] - proximity && value < snapPoints[i] + proximity) {
              return snapPoints[i];
            }
          }
        },
      },
      start: 'top top',
      end: '+=' + this.getTotalScroll(),
    });
  };

  this.setupTimeline = () => {
    tl = gsap.timeline();
    tl.addLabel("label-initial");

    const scrollDistances = [700, 1400, 2100, 2800, 3500, 4200, 4900, 5600, 6300];

    sections.forEach((section, index) => {
      const nextSection = sections[index + 1];
      if (!nextSection) return;

      tl.to(nextSection, {
        y: -1 * scrollDistances[index],
        duration: nextSection.offsetHeight,
        ease: 'linear',
      }).addLabel(`label${index}`);
    });
  };

  this.onResize = () => {
    win = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    this.reset();
  };

  this.reset = () => {
    if (typeof ScrollTrigger.getById('mainScroll') === 'object') {
      ScrollTrigger.getById('mainScroll').kill();
    }

    if (typeof tl === 'object') {
      tl.kill();
      tl.seek(0);
    }

    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.init();
  };

  this.getTotalScroll = () => {
    let totalScroll = 0;
    sections.forEach(section => {
      totalScroll += section.offsetHeight;
    });
    totalScroll -= win.h;
    return totalScroll;
  };
};

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
          e.preventDefault();

          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);

          window.scrollTo({
              top: targetSection.offsetTop,
              behavior: 'smooth'
          });
      });
  });
});



  
const myScroll = new Scroll(".slide #tv .cc", ".slide", ".slide #tv");
myScroll.init();

const roundtwo = new Scroll(".slid2 #tv .cc", ".slid2", ".slid2 #tv");
roundtwo.init();

const roundthree = new Scroll(".slid3 #tv .cc", ".slid3", ".slid3 #tv");
roundthree.init();