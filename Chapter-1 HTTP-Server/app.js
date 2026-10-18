
const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    switch (request.url) {
        case '/':
            response.end('Welcome to my first Node.js server!\n');
            break;

        case '/about':
            response.end('This is the About page.\n');
            break;

        case '/contact':
            response.end('Contact us at example@gmail.com\n');
            break;

        case '/services':
            response.end('We provide web development services.\n');
            break;

        case '/home':
            response.end('Welcome to the Home page.\n');
            break;

        default:
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.end('404 - Page Not Found!\n');
    }
});

const PORT = 4011;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
