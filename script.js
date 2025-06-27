// ----------- خلفية الكتب المتطايرة (Canvas) ----------- //
const canvas = document.getElementById('bgBooks');
const ctx = canvas.getContext('2d');

let books = [];
const bookImg1 = new Image();
const bookImg2 = new Image();
bookImg1.src = "https://cdn.pixabay.com/photo/2017/01/31/13/14/book-2022464_1280.png";
bookImg2.src = "https://cdn.pixabay.com/photo/2014/08/27/13/44/book-429762_1280.png";

function randomBook() {
    const imgs = [bookImg1, bookImg2];
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        w: 36 + Math.random() * 26,
        h: 32 + Math.random() * 16,
        speed: 0.5 + Math.random() * 1.2,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random()-0.5) * 0.009,
        drift: (Math.random()-0.5) * 1.3,
        img: imgs[Math.floor(Math.random()*imgs.length)],
        sway: Math.random() * 2 * Math.PI,
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener('resize', () => {
    resizeCanvas();
    if (books.length < 24) {
        for (let i = books.length; i < 24; ++i)
            books.push(randomBook());
    }
});

let mouse = {x: window.innerWidth/2, y: window.innerHeight/2};
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animateBooks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let b of books) {
        // تأثير التفاعل مع الماوس
        let dx = (mouse.x - b.x) * 0.0006;
        let dy = (mouse.y - b.y) * 0.0008;
        b.x += b.drift + dx * 30;
        b.y += b.speed + Math.sin(Date.now()/700 + b.sway) * .15 + dy * 30;
        b.angle += b.spin;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.globalAlpha = 0.7;
        ctx.drawImage(b.img, -b.w/2, -b.h/2, b.w, b.h);
        ctx.restore();

        // إعادة الكتاب للأعلى إذا خرج من الشاشة
        if (b.y > canvas.height + 80) {
            b.x = Math.random() * canvas.width;
            b.y = -60;
            b.drift = (Math.random()-0.5) * 1.3;
        }
        if (b.x < -80) b.x = canvas.width + 40;
        if (b.x > canvas.width + 80) b.x = -40;
    }

    requestAnimationFrame(animateBooks);
}

// إنشاء الكتب المتطايرة
function initBooks() {
    books = [];
    for (let i = 0; i < 24; ++i)
        books.push(randomBook());
    animateBooks();
}
bookImg1.onload = bookImg2.onload = () => {
    if (bookImg1.complete && bookImg2.complete) initBooks();
};

// ----------- وظائف الأزرار ----------- //
function scrollToSection(sectionId) {
    const sec = document.getElementById(sectionId);
    if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function contactMe() {
    // غير اسم حسابك هنا
    const instaUser = "amine_des18";
    const instaLink = `https://instagram.com/${instaUser}`;
    const msg =
        `📷 للتواصل معي عبر إنستغرام:\n\n` +
        `- حسابي: @${instaUser}\n\n` +
        `هل تريد فتح صفحتي على إنستغرام الآن؟`;

    if (confirm(msg))
        window.open(instaLink, "_blank");
}