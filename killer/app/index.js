const app = 'Killer';

const pulsate = () => {
    const message = 'I am a simple application that does nothing but report the date.';
    const date = new Date();
    const str = JSON.stringify({app, message, date});
    console.log(str);
};

setInterval(pulsate, 1000);

const shutdown = (signal) => {
    if(!signal){
        console.log(`${app} API Server shutting down at ${new Date()}`);
    }else{
        console.log(`Signal ${signal} : ${app} API Server shutting down at ${new Date()}`);
    }
};

process.on('SIGTERM', function () {
    shutdown('SIGTERM');
});

process.on('SIGINT', function () {
    shutdown('SIGINT');
});

process.on('exit', function () {
    shutdown('exit');
});
