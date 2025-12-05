function Component(constructor: Function) {
    constructor.prototype.someId = Date.now();
    constructor.prototype.insertInDom = () => {
        console.log("inside insertInDom");
    };
}

@Component
class SampleComponent { }