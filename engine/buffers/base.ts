// import {TypedArray} from "../types";
//
//
// export class BaseBuffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: TypedArray,
//         public readonly sub_arrays: TypedArray[]
//     ) {
//         for (let i = 0; i < this.count; i++)
//             this.sub_arrays[i] = this.array.subarray(
//                 this.stride * i,
//                 this.stride * (i + 1)
//             );
//     }
// }
// export type BufferType = {
//     new (count: number, stride: number) : BaseBuffer
// }
//
// export class Float32Buffer extends BaseBuffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: Float32Array = new Float32Array(count * stride),
//         public readonly sub_arrays: Float32Array[] = new Array<Float32Array>(count)
//     ) {
//         super(count, stride, array, sub_arrays);
//     }
//
//     setTo = (values: number[]) => this.array.set(values);
// }
//
// export class Uint32Buffer extends BaseBuffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: Uint32Array = new Uint32Array(count * stride),
//         public readonly sub_arrays: Uint32Array[] = new Array<Uint32Array>(count),
//     ) {
//         super(count, stride, array, sub_arrays);
//     }
// }
//
// export class Uint8Buffer extends BaseBuffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: Uint8Array = new Uint8Array(count * stride),
//         public readonly sub_arrays: Uint8Array[] = new Array<Uint8Array>(count),
//     ) {
//         super(count, stride, array, sub_arrays);
//     }
// }
//
// // class Buffer {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //         public readonly array: TypedArray,
// //         public readonly sub_arrays: TypedArray[],
// //     ) {
// //         for (let i = 0; i < count; i++)
// //             sub_arrays[i] = array.subarray(
// //                 stride * i,
// //                 stride * (i + 1)
// //             );
// //     }
// //
// //     setTo(values: number[]) {
// //         this.array.set(values);
// //     }
// // }
// //
// // export class Float32Buffer {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //         public readonly array: Float32Array,
// //         public readonly sub_arrays: Float32Array[] = new Array<Float32Array>(count),
// //     ) {
// //         for (let i = 0; i < count; i++)
// //             sub_arrays[i] = array.subarray(
// //                 stride * i,
// //                 stride * (i + 1)
// //             );
// //     }
// //
// //     setTo(values: number[]) {
// //         this.array.set(values);
// //     }
// // }
// //
// // export class Float32Buffer extends Buffer {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //     ) {
// //         super(
// //             count,
// //             stride,
// //             new Float32Array(count * stride),
// //             new Array<Float32Array>(count)
// //         );
// //     }
// // }
// //
// // export class Uint32Buffer extends Buffer {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //     ) {
// //         super(
// //             count,
// //             stride,
// //             new Uint32Array(count * stride),
// //             new Array<Uint32Array>(count)
// //         );
// //     }
// // }
// //
// // export class Uint8Buffer extends Buffer {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //     ) {
// //         super(
// //             count,
// //             stride,
// //             new Uint32Array(count * stride),
// //             new Array<Uint8Array>(count)
// //         );
// //     }
// // }
//
//
// // class Buffer {
// //     static type =
// //
// //         constructor(
// //             public readonly count: number,
// //     public readonly stride: number)
// //     private readonly sub_arrays: Array<T> = []
// // ) {
// //     this.buffer = new T();
// //     this.sub_arrays.length = count;
// //
// //     return new Proxy(this, {
// //         get: (obj, key) => {
// //     if (typeof(key) === 'string' && (Number.isInteger(Number(key)))) // key is an index
// //     return obj.buffer[key]
// //     else
// //     return obj[key]
// // },
// // set: (obj, key, value) => {
// //     if (typeof(key) === 'string' && (Number.isInteger(Number(key)))) // key is an index
// //         return obj.buffer[key] = value
// //     else
// //         return obj[key] = value
// // }
// // })
// // }
// //
// // at(index: number) : T {
// //     if (this.sub_arrays[index] === undefined)
// //         this.sub_arrays[index] = this.buffer.subarray()
// // }
// // }
//
// // const TypedArrayPrototype = Object.getPrototypeOf(Uint8Array);
// // type TypedArray = typeof TypedArrayPrototype;
//
// // interface ArrayBufferView {
// //     buffer: ArrayBuffer;
// //     byteLength: number;
// //     byteOffset: number;
// //     subarray(begin: number, end: number);
// // }
// //
// // interface ArrayBufferConstructor {
// //     readonly prototype: ArrayBuffer;
// //     new (byteLength: number): ArrayBuffer;
// //     isView(arg: any): arg is ArrayBufferView;
// // }
// //
// // class Buffer<ArrayBufferView> extends Array<ArrayBufferView> {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //
// //         protected readonly buffer: ArrayBufferView = new ArrayBufferConstructor(),
// //         protected readonly sub_arrays: ArrayBufferView[]
// //     ) {
// //         super();
// //         this.sub_arrays.length = count;
// //         return new Proxy(this, this);
// //     }
// //
// //     public get(target: any, prop: string|number) : ArrayBufferView {
// //         if (typeof prop === "number") {
// //             if (this.sub_arrays[prop] === undefined) {
// //                 this.sub_arrays[prop] = this.buffer.subarray(
// //                     this.stride * prop,
// //                     this.stride * (prop + 1)
// //                 );
// //             }
// //         } else return this[prop];
// //     }
// // }
//
// //
// // type BufferConstructor = new() => ReturnType extends ArrayBuffer;
// //
// // export default class Buffer {
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //         private readonly type: {new () => },
// //         private readonly buffer: B = new type(count * stride)
// //     ) {
// //
// //     }
// //
// // }
// //
// // export default class Buffer<T, B extends ArrayBuffer> {
// //
// //
// //     constructor(
// //         public readonly count: number,
// //         public readonly stride: number,
// //         private readonly BufferType: {new(): B;},
// //         private readonly buffer: B = new BufferType(count * stride)
// //     ) {
// //
// //     }
// //
// // }