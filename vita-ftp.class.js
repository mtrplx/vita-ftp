const { Client } = require('basic-ftp');

class Vita_ftp {

    constructor ({ host_ip, port, user = "", password = "", download_path, verbose = false }) {
        this.download_path = download_path;
        this.client = new Client();
        this.client.ftp.verbose = verbose;
        this.host_ip = host_ip;
        this.port = port;
        this.user = user;
        this.password = password;
    }

    async connect () {
        await this.client.access({
            host: this.host_ip,
            port: this.port,
            user: this.user,
            password: this.password
        })
    }

    async get_CAMERA_folders () {
        await this.connect();
        await this.client.cd(`ux0:picture/CAMERA`);
        let folders = await this.client.list();
        let folder_names = [];
        folders.forEach( element => {
            folder_names.push(element.name);
        })
        await this.client.close();
        this.CAMERA_folders = folder_names
        return folder_names;
    }

    async get_CAMERA_file_names () {
        let files = [];
        for(let folder of this.CAMERA_folders){
            await this.connect();
            await this.client.cd(`ux0:picture/CAMERA/${folder}`);
            let file = await this.client.list();
            if(file[0] != undefined){
                file[0].parentFolder = folder;
                files.push(file);
            }
            await this.client.close();
        }
        this.CAMERA_file_names = [];
        files.forEach( file => {
            if(file[0] != undefined){
                this.CAMERA_file_names.push({
                    filename : file[0].name,
                    parentFolder : file[0].parentFolder
                });
            }
        })
    }       

    async download_CAMERA_files () {
        await this.get_CAMERA_folders();
        await this.get_CAMERA_file_names();

        for(let filename of this.CAMERA_file_names){
            await this.connect();
            await this.client.cd(`ux0:picture/CAMERA/${filename.parentFolder}`);
            await this.client.downloadToDir(this.download_path, filename.name);
            await this.client.close();
        }
    }

    async get_SCREENSHOT_folders () {
        await this.connect();
        await this.client.cd(`ux0:picture/SCREENSHOT`);
        let folders = await this.client.list();
        let folder_names = [];
        folders.forEach( element => {
            folder_names.push(element.name);
        })
        await this.client.close();
        this.SCREENSHOT_folders = folder_names;
        return folder_names;
    }

    async get_SCREENSHOT_file_names () {
        let files = [];
        for(let folder of this.SCREENSHOT_folders){
            await this.connect();
            await this.client.cd(`ux0:picture/SCREENSHOT/${folder}`);
            let file = await this.client.list();
            if(file[0] != undefined){
                file[0].parentFolder = folder;
                files.push(file);
            }
            await this.client.close();
        }
        this.SCREENSHOT_file_names = [];
        files.forEach( file => {
            if(file[0] != undefined){
                this.SCREENSHOT_file_names.push({
                    filename : file[0].name,
                    parentFolder: file[0].parentFolder
                });
            }
        })
    }

    async download_SCREENSHOT_files () {
        await this.get_SCREENSHOT_folders();
        await this.get_SCREENSHOT_file_names();

        for(let filename of this.SCREENSHOT_file_names){
            await this.connect();
            await this.client.cd(`ux0:picture/SCREENSHOT/${filename.parentFolder}`);
            await this.client.downloadToDir(this.download_path, filename.name);
            await this.client.close();
        }
    }

}

module.exports = Vita_ftp;