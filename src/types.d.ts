type SupportedLanguages = 'javascript' | 'python' | 'php' | 'c' | 'c++';

// interface IPCMessage<T> {
//     requestId: string;
//     payload: T;
// };

interface ExecutionRequest {
    sourceCode: string;
    language: SupportedLanguages;
};

interface ExecutionResult {
    timeInMs?: string;
    output: string;
    error: string;
    memory?: string;
};