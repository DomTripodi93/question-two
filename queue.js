var events = require('events');

class AsyncQueue extends events.EventEmitter {
    constructor(){
        super();
        this.first = null;
        this.last = null;
        this.length = 0;
        this.interval = 250;
        this.running = false;
        this.on('interval', (item)=>{this.updateInterval(item)});
    }
    
    enqueue = (item) => {
        let newItem = {value: item, next: null}
        if (this.length === 0){
            this.first = newItem;
            this.last = newItem;
        } else {
            this.last.next = newItem;
            this.last = newItem;
        }
        this.length++
        this.emit("enqueued", item);
    }

    peek = () => {
        if (this.first){
            return this.first.value;
        } 
        return null;
    }

    print = () => {
        let arrayOfQueue = []
        let currentItem = this.first;
        for (let i=this.length; i>0; i--){
            arrayOfQueue.push(currentItem.value);
            currentItem = currentItem.next;
        }
        return arrayOfQueue;
    }

    getCurrentInterval = () => {
        return this.interval;
    }

    start = () => {
        this.run();
        this.running = true;
    }

    run = () => {
        setTimeout(()=>{
            if (this.running){
                let firstHold = this.first
                if (this.first){
                    this.first = this.first.next;
                }
                if (this.length > 0){
                    this.length--;
                }
                if (firstHold && this.first === this.last) {
                    this.last = null;
                    this.emit("dequeued", firstHold.value);
                } else if (firstHold) {
                    this.emit("dequeued", firstHold.value);
                }
                if (this.running){
                    this.run();
                }
            }
        }, this.interval);
    }

    updateInterval = (newInterval) => {
        this.interval = newInterval;
        this.run();
    }

    pause = () => {
        this.running = false;
    }

}


module.exports = AsyncQueue;