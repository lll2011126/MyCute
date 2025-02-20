
const os = require('os');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class OSUtils {
    constructor() {
        this.cpuUsageMSDefault = 1000; // CPU 利用率默认时间段
    }

    /**
        * 获取某时间段 CPU 利用率
        * @param { Number } Options.ms [时间段，默认是 1000ms，即 1 秒钟]
        * @param { Boolean } Options.percentage [true（以百分比结果返回）|false] 
        * @returns { Promise }
        */
    async getCPUUsage(options={}) {
        const that = this;
        let { cpuUsageMS, percentage } = options;
        cpuUsageMS = cpuUsageMS || that.cpuUsageMSDefault;
        const t1 = that._getCPUInfo(); // t1 时间点 CPU 信息

        await sleep(cpuUsageMS);

        const t2 = that._getCPUInfo(); // t2 时间点 CPU 信息
        const idle = t2.idle - t1.idle;
        const total = t2.total - t1.total;
        let usage = 1 - idle / total;

        if (percentage) usage = (usage * 100.0).toFixed(2) + "%";

        return usage;
    }

    /**
        * 获取 CPU 信息
        * @returns { Object } CPU 信息
        */
    _getCPUInfo() {
        const cpus = os.cpus();
        let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;

        for (let cpu in cpus) {
            const times = cpus[cpu].times;
            user += times.user;
            nice += times.nice;
            sys += times.sys;
            idle += times.idle;
            irq += times.irq;
        }

        total += user + nice + sys + idle + irq;

        return {
            user,
            sys,
            idle,
            total,
        }
    }
}

// var os = require("os");
// var gbTotal = ((os.totalmem())/1048576/1024);
// var mbFree = ((os.freemem())/1048576);
// console.log("There are "+mbFree+"mb free in the memory of "+gbTotal+"gb in total");
//
// var osUtils =new OSUtils();
// const cpuUsage =  osUtils.getCPUUsage({ percentage: true });
//
// cpuUsage.then((value) => {
//     console.log(value);
// })
// console.log('CPU 利用率：', cpuUsage) // CPU 利用率：13.72%