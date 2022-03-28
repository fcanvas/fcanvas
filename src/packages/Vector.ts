/* eslint-disable prefer-rest-params */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */

function calculateRemainder2D(
  this: Vector,
  xComponent: number,
  yComponent: number
) {
  if (xComponent !== 0) {
    this.x %= xComponent;
  }

  if (yComponent !== 0) {
    this.y %= yComponent;
  }

  return this;
}

function calculateRemainder3D(
  this: Vector,
  xComponent: number,
  yComponent: number,
  zComponent: number
) {
  if (xComponent !== 0) {
    this.x %= xComponent;
  }

  if (yComponent !== 0) {
    this.y %= yComponent;
  }

  if (zComponent !== 0) {
    this.z %= zComponent;
  }

  return this;
}

export class Vector {
  // eslint-disable-next-line functional/prefer-readonly-type
  x: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  y: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  z: number;
  constructor(x = 0, y = 0, z = 0) {
    [this.x, this.y, this.z] = [x, y, z];
  }

  set(vector: Vector): this;
  set(offset: readonly [number?, number?, number?]): this;
  set(x?: number, y?: number, z?: number): this;
  set(
    x?: Vector | readonly [number?, number?, number?] | number,
    y?: number,
    z?: number
  ): this {
    if (x instanceof Vector) {
      this.x = x.x || 0;
      this.y = x.y || 0;
      this.z = x.z || 0;
      return this;
    }

    if (x instanceof Array) {
      this.x = x[0] || 0;
      this.y = x[1] || 0;
      this.z = x[2] || 0;
      return this;
    }

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
  }

  copy(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  add(vector: Vector): this;
  add(offset: readonly [number?, number?, number?]): this;
  add(x: number, y: number, z: number): this;
  add(
    x: Vector | readonly [number?, number?, number?] | number,
    y?: number,
    z?: number
  ): this {
    if (x instanceof Vector) {
      this.x += x.x || 0;
      this.y += x.y || 0;
      this.z += x.z || 0;
      return this;
    }

    if (x instanceof Array) {
      this.x += x[0] || 0;
      this.y += x[1] || 0;
      this.z += x[2] || 0;
      return this;
    }

    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  }

  rem(vector: Vector): void;
  rem(params: readonly [number, number?, number?]): void;
  rem(x: Vector | readonly [number, number?, number?]): void {
    if (x instanceof Vector) {
      if (
        Number.isFinite(x.x) &&
        Number.isFinite(x.y) &&
        Number.isFinite(x.z)
      ) {
        calculateRemainder3D.call(this, x.x, x.y, x.z);
      }
    } else if (x instanceof Array) {
      if (
        x.every(function (element) {
          return Number.isFinite(element);
        })
      ) {
        if (x.length === 2) {
          calculateRemainder2D.call(this, x[0], x[1] as number);
        }

        if (x.length === 3) {
          calculateRemainder3D.call(this, x[0], x[1] as number, x[2] as number);
        }
      }
    } else if (arguments.length === 1) {
      if (Number.isFinite(arguments[0]) && arguments[0] !== 0) {
        this.x = this.x % arguments[0];
        this.y = this.y % arguments[0];
        this.z = this.z % arguments[0];
      }
    } else if (arguments.length === 2) {
      const vectorComponents = [].slice.call(arguments);

      if (
        vectorComponents.every(function (element) {
          return Number.isFinite(element);
        })
      ) {
        if (vectorComponents.length === 2) {
          calculateRemainder2D.call(
            this,
            vectorComponents[0],
            vectorComponents[1]
          );
        }
      }
    } else if (arguments.length === 3) {
      const _vectorComponents = [].slice.call(arguments);

      if (
        _vectorComponents.every(function (element) {
          return Number.isFinite(element);
        })
      ) {
        if (_vectorComponents.length === 3) {
          calculateRemainder3D.call(
            this,
            _vectorComponents[0],
            _vectorComponents[1],
            _vectorComponents[2]
          );
        }
      }
    }
  }

  sub(vector: Vector): this;
  sub(offset: readonly [number?, number?, number?]): this;
  sub(x: number, y: number, z: number): this;
  sub(
    x: Vector | readonly [number?, number?, number?] | number,
    y?: number,
    z?: number
  ): this {
    if (x instanceof Vector) {
      this.x -= x.x || 0;
      this.y -= x.y || 0;
      this.z -= x.z || 0;
      return this;
    }

    if (x instanceof Array) {
      this.x -= x[0] || 0;
      this.y -= x[1] || 0;
      this.z -= x[2] || 0;
      return this;
    }

    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  }

  mult(n: number): this {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }

  div(n: number): this {
    if (n === 0) {
      console.warn("div:", "divide by 0");
      return this;
    }

    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  magSq(): number {
    const { x, y, z } = this;
    return x * x + y * y + z * z;
  }

  dot(vector: Vector): number;
  dot(x?: number, y?: number, z?: number): number;
  dot(x?: number | Vector, y?: number, z?: number): number {
    if (x instanceof Vector) {
      return this.dot(x.x, x.y, x.z);
    }

    return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
  }

  cross(v: Vector): Vector {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  normalize(): this {
    const len = this.mag();
    if (len !== 0) {
      this.mult(1 / len);
    }
    return this;
  }

  limit(max: number): this {
    const mSq: number = this.magSq();

    if (mSq > max ** 2) {
      this.div(Math.sqrt(mSq)) //normalize it
        .mult(max);
    }

    return this;
  }

  setMag(n: number): this {
    return this.normalize().mult(n);
  }

  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle: number): this {
    const newHeading: number = this.heading() + angle;
    const mag: number = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  }

  angleBetween(vector: Vector): number {
    const dotmagmag = this.dot(vector) / (this.mag() * vector.mag());
    const angle =
      Math.acos(Math.min(1, Math.max(-1, dotmagmag))) *
      Math.sign(this.cross(vector).z || 1);
    return angle;
  }

  lerp(vector: Vector, amt?: number): this;
  lerp(x?: number, y?: number, z?: number, amt?: number): this;
  lerp(x: Vector | number = 0, y = 0, z = 0, amt = 0): this {
    if (x instanceof Vector) {
      return this.lerp(x.x, x.y, x.z, y);
    }

    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  }

  reflect(surfaceNormal: Vector): this {
    surfaceNormal.normalize();
    return this.sub(surfaceNormal.mult(2 * this.dot(surfaceNormal)));
  }

  array(): readonly [number, number, number] {
    return [this.x || 0, this.y || 0, this.z || 0];
  }

  equals(vector: Vector): boolean;
  equals(params: readonly [number?, number?, number?]): boolean;
  equals(x?: number, y?: number, z?: number): boolean;
  equals(
    x?: Vector | readonly [number?, number?, number?] | number,
    y?: number,
    z?: number
  ): boolean {
    // eslint-disable-next-line functional/no-let
    let a, b, c;

    if (x instanceof Vector) {
      a = x.x || 0;
      b = x.y || 0;
      c = x.z || 0;
    } else if (x instanceof Array) {
      a = x[0] || 0;
      b = x[1] || 0;
      c = x[2] || 0;
    } else {
      a = x || 0;
      b = y || 0;
      c = z || 0;
    }

    return this.x === a && this.y === b && this.z === c;
  }

  toString(): string {
    return "Vector: [" + this.array().join(", ") + "]";
  }
}
