const Vita_ftp = require('./vita-ftp.class.js');

let vita_ftp = new Vita_ftp({
    host_ip : '192.168.1.133',
    port : '1337',
    download_path : './downloads' 
});

const download = async () => {
    await vita_ftp.download_CAMERA_files();
    await vita_ftp.download_SCREENSHOT_files();
}

download();