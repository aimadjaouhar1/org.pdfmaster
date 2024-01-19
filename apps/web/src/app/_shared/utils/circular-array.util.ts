export class CircularArray<T> {
    private array: T[];
    private maxSize: number;
    private currentIndex: number;

    private poppedValues: T[] = [];
  
    constructor(maxSize: number) {
      this.array = new Array<T>(maxSize);
      this.maxSize = maxSize;
      this.currentIndex = 0;
    }

    get lastItem(): T { return this.array[(this.currentIndex - 1 + this.maxSize) % this.maxSize] }

    get length(): number { return this.array.filter(item => item).length }

  
    push(item: T): void {
      this.array[this.currentIndex] = item;
      this.currentIndex = (this.currentIndex + 1) % this.maxSize;
    }

    pop(): void {
      this.currentIndex = (this.currentIndex - 1 + this.maxSize) % this.maxSize;
      const poppedValue = this.array.splice(this.currentIndex, 1)[0];
      if(poppedValue) this.poppedValues.push(poppedValue);
    }

    clearPoppedValues = () => this.poppedValues = [];

    restore() {
      const restoredValue = this.poppedValues.pop();
      if(restoredValue) this.push(restoredValue);
    }
  
    toArray(): T[] {
      return [...this.array.slice(this.currentIndex), ...this.array.slice(0, this.currentIndex)];
    }
  }
  

