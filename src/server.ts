import express, { Request, Response } from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import net from 'net';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const supportedLanguages: SupportedLanguages[] = ['c', 'c++', 'javascript', 'php', 'python'];

const getFileName = (): string => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // January is 0
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = currentDate.getMilliseconds().toString().padStart(2, '0');

    return `${day}${month}${year}_${hours}${minutes}${seconds}${milliseconds}`;
};

const wsServer = new WebSocketServer({ port: parseInt(PORT.toString()) }, () => {
    console.log(`WebSocket Server listening on port ${PORT}`);
});
wsServer.on("connection", (socket, request) => {
    console.log('Client connected');

    socket.on('message', (data) => {
        try {
            console.log("data:", data.toString());
            const { language, sourceCode } = JSON.parse(data.toString()) as ExecutionRequest;

            if (!supportedLanguages.includes(language)) {
                return socket.send(JSON.stringify({ error: 'Unsupported language' }));
            }

            console.log(`language=${language}`);

            const fileName = `${getFileName()}.${language}`;
            const filePath = `/app/temp/${fileName}`;

            console.log({
                filePath
            });

            fs.writeFileSync(filePath, sourceCode);

            exec(`sh scripts/execute.sh "${language}" "${filePath}"`, (error, stdout, stderr) => {
                const executionResult: ExecutionResult = { output: stdout, error: stderr };
                console.log("executionResult:", executionResult);
                if (error) {
                    console.error(`Error executing code: ${error}`);
                    console.error(`Error: ${stderr}`);
                }

                socket.send(JSON.stringify(executionResult));
                socket.close();
            });
        } catch (err) {
            console.log({
                error: err
            });
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

// const server = net.createServer(socket => {
//     console.log('Client connected');

//     socket.on('data', data => {
//         try {
//             console.log("data:", data.toString());
//             const { language, sourceCode } = JSON.parse(data.toString()) as ExecutionRequest;

//             if (!supportedLanguages.includes(language)) {
//                 return socket.write(JSON.stringify({ error: 'Unsupported language' }));
//             }

//             console.log(`language=${language}`);

//             const fileName = `${getFileName()}.${language}`;
//             const filePath = `/app/temp/${fileName}`;

//             console.log({
//                 filePath
//             });

//             fs.writeFileSync(filePath, sourceCode);

//             exec(`sh scripts/execute.sh "${language}" "${filePath}"`, (error, stdout, stderr) => {
//                 const executionResult: ExecutionResult = { output: stdout, error: stderr };
//                 console.log("executionResult:", executionResult);
//                 if (error) {
//                     console.error(`Error executing code: ${error}`);
//                     console.error(`Error: ${stderr}`);
//                 }

//                 socket.write(JSON.stringify(executionResult));
//                 socket.destroy();
//             });
//         } catch (err) {
//             console.log({
//                 error: err
//             });
//         }
//     });

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });