// script.js

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('is-active');
    });

    // Close mobile menu on clicking a link
    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('is-active');
    }));
}

// Header blur on scroll
const header = document.querySelector('.header') || document.querySelector('.navbar');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Active Link Highlighting on Scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');

        let link = document.querySelector('.nav-links a[href*=' + sectionId + ']');
        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Fetch Live Blogs from Dev.to API
document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('dynamic-blogs');

    if (blogGrid) {
        // Fetch real, live article data focusing on marketing
        fetch('https://dev.to/api/articles?tag=marketing&per_page=15')
            .then(response => response.json())
            .then(data => {
                blogGrid.innerHTML = ''; // Clear loading state

                // Shuffle array and pick 3 random articles
                const shuffled = data.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);

                const colors = ['gold', 'pink', 'purple'];

                selected.forEach((article, index) => {
                    const colorVariant = colors[index % colors.length];
                    // Use actual live cover image or the unique DEV social image fallback
                    const imageSrc = article.cover_image || article.social_image || `https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=500&sig=${Math.random()}`;

                    const articleHTML = `
                      <a href="${article.url}" target="_blank" class="blog-card border-black shadow-${colorVariant}" style="display: flex; flex-direction: column; height: 100%; text-decoration: none;">
                        <img src="${imageSrc}" alt="${article.title}" class="blog-image bg-${colorVariant}" style="object-fit: cover;" />
                        <div class="blog-info" style="display: flex; flex-direction: column; flex-grow: 1;">
                          <h4 style="color: var(--black); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${article.title}
                          </h4>
                          <div class="blog-meta" style="margin-top: auto;">
                            <span class="author">By ${article.user.name}</span>
                            <span class="comments">${article.comments_count} Comments</span>
                          </div>
                        </div>
                      </a>
                    `;
                    blogGrid.innerHTML += articleHTML;
                });

                // Re-trigger scrolltrigger for new items
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                blogGrid.innerHTML = '<div style="padding: 20px; text-align: center;">Could not load live blogs. Please try again later.</div>';
            });
    }
});
