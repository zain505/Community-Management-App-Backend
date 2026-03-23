
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Store
 * 
 */
export type Store = $Result.DefaultSelection<Prisma.$StorePayload>
/**
 * Model StoreProduct
 * 
 */
export type StoreProduct = $Result.DefaultSelection<Prisma.$StoreProductPayload>
/**
 * Model StoreRating
 * 
 */
export type StoreRating = $Result.DefaultSelection<Prisma.$StoreRatingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const NewsFeedEventType: {
  STORE_CREATED: 'STORE_CREATED',
  STORE_NAME_UPDATED: 'STORE_NAME_UPDATED',
  STORE_LOCATION_UPDATED: 'STORE_LOCATION_UPDATED',
  STORE_RATING_UPDATED: 'STORE_RATING_UPDATED',
  STORE_IMAGE_UPDATED: 'STORE_IMAGE_UPDATED',
  STORE_DELIVERY_UPDATED: 'STORE_DELIVERY_UPDATED',
  STORE_MIN_ORDER_UPDATED: 'STORE_MIN_ORDER_UPDATED',
  STORE_CONTACT_UPDATED: 'STORE_CONTACT_UPDATED',
  STORE_PROFILE_UPDATED: 'STORE_PROFILE_UPDATED',
  PRODUCT_ADDED: 'PRODUCT_ADDED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  POPULAR_STORE_CHANGED: 'POPULAR_STORE_CHANGED',
  MOST_ACTIVE_STORE_CHANGED: 'MOST_ACTIVE_STORE_CHANGED',
  MOST_SEARCHED_STORE_CHANGED: 'MOST_SEARCHED_STORE_CHANGED'
};

export type NewsFeedEventType = (typeof NewsFeedEventType)[keyof typeof NewsFeedEventType]


export const NewsFeedMetric: {
  POPULAR_STORE: 'POPULAR_STORE',
  MOST_ACTIVE_STORE: 'MOST_ACTIVE_STORE',
  MOST_SEARCHED_STORE: 'MOST_SEARCHED_STORE'
};

export type NewsFeedMetric = (typeof NewsFeedMetric)[keyof typeof NewsFeedMetric]

}

export type NewsFeedEventType = $Enums.NewsFeedEventType

export const NewsFeedEventType: typeof $Enums.NewsFeedEventType

export type NewsFeedMetric = $Enums.NewsFeedMetric

export const NewsFeedMetric: typeof $Enums.NewsFeedMetric

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Stores
 * const stores = await prisma.store.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Stores
   * const stores = await prisma.store.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.store`: Exposes CRUD operations for the **Store** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stores
    * const stores = await prisma.store.findMany()
    * ```
    */
  get store(): Prisma.StoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storeProduct`: Exposes CRUD operations for the **StoreProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StoreProducts
    * const storeProducts = await prisma.storeProduct.findMany()
    * ```
    */
  get storeProduct(): Prisma.StoreProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storeRating`: Exposes CRUD operations for the **StoreRating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StoreRatings
    * const storeRatings = await prisma.storeRating.findMany()
    * ```
    */
  get storeRating(): Prisma.StoreRatingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Store: 'Store',
    StoreProduct: 'StoreProduct',
    StoreRating: 'StoreRating'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "store" | "storeProduct" | "storeRating"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Store: {
        payload: Prisma.$StorePayload<ExtArgs>
        fields: Prisma.StoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findFirst: {
            args: Prisma.StoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findMany: {
            args: Prisma.StoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          create: {
            args: Prisma.StoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          createMany: {
            args: Prisma.StoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.StoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          update: {
            args: Prisma.StoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          deleteMany: {
            args: Prisma.StoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          aggregate: {
            args: Prisma.StoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStore>
          }
          groupBy: {
            args: Prisma.StoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreCountArgs<ExtArgs>
            result: $Utils.Optional<StoreCountAggregateOutputType> | number
          }
        }
      }
      StoreProduct: {
        payload: Prisma.$StoreProductPayload<ExtArgs>
        fields: Prisma.StoreProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>
          }
          findFirst: {
            args: Prisma.StoreProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>
          }
          findMany: {
            args: Prisma.StoreProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>[]
          }
          create: {
            args: Prisma.StoreProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>
          }
          createMany: {
            args: Prisma.StoreProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.StoreProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>
          }
          update: {
            args: Prisma.StoreProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>
          }
          deleteMany: {
            args: Prisma.StoreProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StoreProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreProductPayload>
          }
          aggregate: {
            args: Prisma.StoreProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStoreProduct>
          }
          groupBy: {
            args: Prisma.StoreProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreProductCountArgs<ExtArgs>
            result: $Utils.Optional<StoreProductCountAggregateOutputType> | number
          }
        }
      }
      StoreRating: {
        payload: Prisma.$StoreRatingPayload<ExtArgs>
        fields: Prisma.StoreRatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreRatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreRatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>
          }
          findFirst: {
            args: Prisma.StoreRatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreRatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>
          }
          findMany: {
            args: Prisma.StoreRatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>[]
          }
          create: {
            args: Prisma.StoreRatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>
          }
          createMany: {
            args: Prisma.StoreRatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.StoreRatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>
          }
          update: {
            args: Prisma.StoreRatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>
          }
          deleteMany: {
            args: Prisma.StoreRatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreRatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StoreRatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreRatingPayload>
          }
          aggregate: {
            args: Prisma.StoreRatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStoreRating>
          }
          groupBy: {
            args: Prisma.StoreRatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreRatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreRatingCountArgs<ExtArgs>
            result: $Utils.Optional<StoreRatingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    store?: StoreOmit
    storeProduct?: StoreProductOmit
    storeRating?: StoreRatingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type StoreCountOutputType
   */

  export type StoreCountOutputType = {
    products: number
    ratings: number
  }

  export type StoreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | StoreCountOutputTypeCountProductsArgs
    ratings?: boolean | StoreCountOutputTypeCountRatingsArgs
  }

  // Custom InputTypes
  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreCountOutputType
     */
    select?: StoreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreProductWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreRatingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Store
   */

  export type AggregateStore = {
    _count: StoreCountAggregateOutputType | null
    _avg: StoreAvgAggregateOutputType | null
    _sum: StoreSumAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  export type StoreAvgAggregateOutputType = {
    id: number | null
    searchCount: number | null
  }

  export type StoreSumAggregateOutputType = {
    id: number | null
    searchCount: number | null
  }

  export type StoreMinAggregateOutputType = {
    id: number | null
    ownerUserId: string | null
    name: string | null
    location: string | null
    rating: string | null
    image: string | null
    delivery: string | null
    minOrderRs: string | null
    openingTime: string | null
    closingTime: string | null
    phoneNumber: string | null
    searchCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreMaxAggregateOutputType = {
    id: number | null
    ownerUserId: string | null
    name: string | null
    location: string | null
    rating: string | null
    image: string | null
    delivery: string | null
    minOrderRs: string | null
    openingTime: string | null
    closingTime: string | null
    phoneNumber: string | null
    searchCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreCountAggregateOutputType = {
    id: number
    ownerUserId: number
    name: number
    location: number
    rating: number
    image: number
    badges: number
    delivery: number
    minOrderRs: number
    openingTime: number
    closingTime: number
    phoneNumber: number
    searchCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StoreAvgAggregateInputType = {
    id?: true
    searchCount?: true
  }

  export type StoreSumAggregateInputType = {
    id?: true
    searchCount?: true
  }

  export type StoreMinAggregateInputType = {
    id?: true
    ownerUserId?: true
    name?: true
    location?: true
    rating?: true
    image?: true
    delivery?: true
    minOrderRs?: true
    openingTime?: true
    closingTime?: true
    phoneNumber?: true
    searchCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreMaxAggregateInputType = {
    id?: true
    ownerUserId?: true
    name?: true
    location?: true
    rating?: true
    image?: true
    delivery?: true
    minOrderRs?: true
    openingTime?: true
    closingTime?: true
    phoneNumber?: true
    searchCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreCountAggregateInputType = {
    id?: true
    ownerUserId?: true
    name?: true
    location?: true
    rating?: true
    image?: true
    badges?: true
    delivery?: true
    minOrderRs?: true
    openingTime?: true
    closingTime?: true
    phoneNumber?: true
    searchCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Store to aggregate.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stores
    **/
    _count?: true | StoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreMaxAggregateInputType
  }

  export type GetStoreAggregateType<T extends StoreAggregateArgs> = {
        [P in keyof T & keyof AggregateStore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStore[P]>
      : GetScalarType<T[P], AggregateStore[P]>
  }




  export type StoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithAggregationInput | StoreOrderByWithAggregationInput[]
    by: StoreScalarFieldEnum[] | StoreScalarFieldEnum
    having?: StoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreCountAggregateInputType | true
    _avg?: StoreAvgAggregateInputType
    _sum?: StoreSumAggregateInputType
    _min?: StoreMinAggregateInputType
    _max?: StoreMaxAggregateInputType
  }

  export type StoreGroupByOutputType = {
    id: number
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges: JsonValue | null
    delivery: string
    minOrderRs: string
    openingTime: string
    closingTime: string
    phoneNumber: string
    searchCount: number
    createdAt: Date
    updatedAt: Date
    _count: StoreCountAggregateOutputType | null
    _avg: StoreAvgAggregateOutputType | null
    _sum: StoreSumAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  type GetStoreGroupByPayload<T extends StoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreGroupByOutputType[P]>
            : GetScalarType<T[P], StoreGroupByOutputType[P]>
        }
      >
    >


  export type StoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerUserId?: boolean
    name?: boolean
    location?: boolean
    rating?: boolean
    image?: boolean
    badges?: boolean
    delivery?: boolean
    minOrderRs?: boolean
    openingTime?: boolean
    closingTime?: boolean
    phoneNumber?: boolean
    searchCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    products?: boolean | Store$productsArgs<ExtArgs>
    ratings?: boolean | Store$ratingsArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>



  export type StoreSelectScalar = {
    id?: boolean
    ownerUserId?: boolean
    name?: boolean
    location?: boolean
    rating?: boolean
    image?: boolean
    badges?: boolean
    delivery?: boolean
    minOrderRs?: boolean
    openingTime?: boolean
    closingTime?: boolean
    phoneNumber?: boolean
    searchCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerUserId" | "name" | "location" | "rating" | "image" | "badges" | "delivery" | "minOrderRs" | "openingTime" | "closingTime" | "phoneNumber" | "searchCount" | "createdAt" | "updatedAt", ExtArgs["result"]["store"]>
  export type StoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Store$productsArgs<ExtArgs>
    ratings?: boolean | Store$ratingsArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $StorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Store"
    objects: {
      products: Prisma.$StoreProductPayload<ExtArgs>[]
      ratings: Prisma.$StoreRatingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ownerUserId: string
      name: string
      location: string
      rating: string
      image: string
      badges: Prisma.JsonValue | null
      delivery: string
      minOrderRs: string
      openingTime: string
      closingTime: string
      phoneNumber: string
      searchCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["store"]>
    composites: {}
  }

  type StoreGetPayload<S extends boolean | null | undefined | StoreDefaultArgs> = $Result.GetResult<Prisma.$StorePayload, S>

  type StoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoreCountAggregateInputType | true
    }

  export interface StoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Store'], meta: { name: 'Store' } }
    /**
     * Find zero or one Store that matches the filter.
     * @param {StoreFindUniqueArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreFindUniqueArgs>(args: SelectSubset<T, StoreFindUniqueArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Store that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoreFindUniqueOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Store that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreFindFirstArgs>(args?: SelectSubset<T, StoreFindFirstArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Store that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Stores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stores
     * const stores = await prisma.store.findMany()
     * 
     * // Get first 10 Stores
     * const stores = await prisma.store.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeWithIdOnly = await prisma.store.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreFindManyArgs>(args?: SelectSubset<T, StoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Store.
     * @param {StoreCreateArgs} args - Arguments to create a Store.
     * @example
     * // Create one Store
     * const Store = await prisma.store.create({
     *   data: {
     *     // ... data to create a Store
     *   }
     * })
     * 
     */
    create<T extends StoreCreateArgs>(args: SelectSubset<T, StoreCreateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Stores.
     * @param {StoreCreateManyArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreCreateManyArgs>(args?: SelectSubset<T, StoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Store.
     * @param {StoreDeleteArgs} args - Arguments to delete one Store.
     * @example
     * // Delete one Store
     * const Store = await prisma.store.delete({
     *   where: {
     *     // ... filter to delete one Store
     *   }
     * })
     * 
     */
    delete<T extends StoreDeleteArgs>(args: SelectSubset<T, StoreDeleteArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Store.
     * @param {StoreUpdateArgs} args - Arguments to update one Store.
     * @example
     * // Update one Store
     * const store = await prisma.store.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreUpdateArgs>(args: SelectSubset<T, StoreUpdateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Stores.
     * @param {StoreDeleteManyArgs} args - Arguments to filter Stores to delete.
     * @example
     * // Delete a few Stores
     * const { count } = await prisma.store.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreDeleteManyArgs>(args?: SelectSubset<T, StoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stores
     * const store = await prisma.store.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreUpdateManyArgs>(args: SelectSubset<T, StoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Store.
     * @param {StoreUpsertArgs} args - Arguments to update or create a Store.
     * @example
     * // Update or create a Store
     * const store = await prisma.store.upsert({
     *   create: {
     *     // ... data to create a Store
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Store we want to update
     *   }
     * })
     */
    upsert<T extends StoreUpsertArgs>(args: SelectSubset<T, StoreUpsertArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreCountArgs} args - Arguments to filter Stores to count.
     * @example
     * // Count the number of Stores
     * const count = await prisma.store.count({
     *   where: {
     *     // ... the filter for the Stores we want to count
     *   }
     * })
    **/
    count<T extends StoreCountArgs>(
      args?: Subset<T, StoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreAggregateArgs>(args: Subset<T, StoreAggregateArgs>): Prisma.PrismaPromise<GetStoreAggregateType<T>>

    /**
     * Group by Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreGroupByArgs['orderBy'] }
        : { orderBy?: StoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Store model
   */
  readonly fields: StoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Store.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Store$productsArgs<ExtArgs> = {}>(args?: Subset<T, Store$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratings<T extends Store$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, Store$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Store model
   */
  interface StoreFieldRefs {
    readonly id: FieldRef<"Store", 'Int'>
    readonly ownerUserId: FieldRef<"Store", 'String'>
    readonly name: FieldRef<"Store", 'String'>
    readonly location: FieldRef<"Store", 'String'>
    readonly rating: FieldRef<"Store", 'String'>
    readonly image: FieldRef<"Store", 'String'>
    readonly badges: FieldRef<"Store", 'Json'>
    readonly delivery: FieldRef<"Store", 'String'>
    readonly minOrderRs: FieldRef<"Store", 'String'>
    readonly openingTime: FieldRef<"Store", 'String'>
    readonly closingTime: FieldRef<"Store", 'String'>
    readonly phoneNumber: FieldRef<"Store", 'String'>
    readonly searchCount: FieldRef<"Store", 'Int'>
    readonly createdAt: FieldRef<"Store", 'DateTime'>
    readonly updatedAt: FieldRef<"Store", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Store findUnique
   */
  export type StoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findUniqueOrThrow
   */
  export type StoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findFirst
   */
  export type StoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findFirstOrThrow
   */
  export type StoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findMany
   */
  export type StoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Stores to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store create
   */
  export type StoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to create a Store.
     */
    data: XOR<StoreCreateInput, StoreUncheckedCreateInput>
  }

  /**
   * Store createMany
   */
  export type StoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Store update
   */
  export type StoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to update a Store.
     */
    data: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
    /**
     * Choose, which Store to update.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store updateMany
   */
  export type StoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stores.
     */
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyInput>
    /**
     * Filter which Stores to update
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to update.
     */
    limit?: number
  }

  /**
   * Store upsert
   */
  export type StoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The filter to search for the Store to update in case it exists.
     */
    where: StoreWhereUniqueInput
    /**
     * In case the Store found by the `where` argument doesn't exist, create a new Store with this data.
     */
    create: XOR<StoreCreateInput, StoreUncheckedCreateInput>
    /**
     * In case the Store was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
  }

  /**
   * Store delete
   */
  export type StoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter which Store to delete.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store deleteMany
   */
  export type StoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stores to delete
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to delete.
     */
    limit?: number
  }

  /**
   * Store.products
   */
  export type Store$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    where?: StoreProductWhereInput
    orderBy?: StoreProductOrderByWithRelationInput | StoreProductOrderByWithRelationInput[]
    cursor?: StoreProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreProductScalarFieldEnum | StoreProductScalarFieldEnum[]
  }

  /**
   * Store.ratings
   */
  export type Store$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    where?: StoreRatingWhereInput
    orderBy?: StoreRatingOrderByWithRelationInput | StoreRatingOrderByWithRelationInput[]
    cursor?: StoreRatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreRatingScalarFieldEnum | StoreRatingScalarFieldEnum[]
  }

  /**
   * Store without action
   */
  export type StoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
  }


  /**
   * Model StoreProduct
   */

  export type AggregateStoreProduct = {
    _count: StoreProductCountAggregateOutputType | null
    _avg: StoreProductAvgAggregateOutputType | null
    _sum: StoreProductSumAggregateOutputType | null
    _min: StoreProductMinAggregateOutputType | null
    _max: StoreProductMaxAggregateOutputType | null
  }

  export type StoreProductAvgAggregateOutputType = {
    storeId: number | null
  }

  export type StoreProductSumAggregateOutputType = {
    storeId: number | null
  }

  export type StoreProductMinAggregateOutputType = {
    id: string | null
    name: string | null
    price: string | null
    image: string | null
    tag: string | null
    createdAt: Date | null
    updatedAt: Date | null
    storeId: number | null
  }

  export type StoreProductMaxAggregateOutputType = {
    id: string | null
    name: string | null
    price: string | null
    image: string | null
    tag: string | null
    createdAt: Date | null
    updatedAt: Date | null
    storeId: number | null
  }

  export type StoreProductCountAggregateOutputType = {
    id: number
    name: number
    price: number
    image: number
    tag: number
    createdAt: number
    updatedAt: number
    storeId: number
    _all: number
  }


  export type StoreProductAvgAggregateInputType = {
    storeId?: true
  }

  export type StoreProductSumAggregateInputType = {
    storeId?: true
  }

  export type StoreProductMinAggregateInputType = {
    id?: true
    name?: true
    price?: true
    image?: true
    tag?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
  }

  export type StoreProductMaxAggregateInputType = {
    id?: true
    name?: true
    price?: true
    image?: true
    tag?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
  }

  export type StoreProductCountAggregateInputType = {
    id?: true
    name?: true
    price?: true
    image?: true
    tag?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
    _all?: true
  }

  export type StoreProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreProduct to aggregate.
     */
    where?: StoreProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreProducts to fetch.
     */
    orderBy?: StoreProductOrderByWithRelationInput | StoreProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StoreProducts
    **/
    _count?: true | StoreProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoreProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoreProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreProductMaxAggregateInputType
  }

  export type GetStoreProductAggregateType<T extends StoreProductAggregateArgs> = {
        [P in keyof T & keyof AggregateStoreProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoreProduct[P]>
      : GetScalarType<T[P], AggregateStoreProduct[P]>
  }




  export type StoreProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreProductWhereInput
    orderBy?: StoreProductOrderByWithAggregationInput | StoreProductOrderByWithAggregationInput[]
    by: StoreProductScalarFieldEnum[] | StoreProductScalarFieldEnum
    having?: StoreProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreProductCountAggregateInputType | true
    _avg?: StoreProductAvgAggregateInputType
    _sum?: StoreProductSumAggregateInputType
    _min?: StoreProductMinAggregateInputType
    _max?: StoreProductMaxAggregateInputType
  }

  export type StoreProductGroupByOutputType = {
    id: string
    name: string
    price: string
    image: string
    tag: string | null
    createdAt: Date
    updatedAt: Date
    storeId: number
    _count: StoreProductCountAggregateOutputType | null
    _avg: StoreProductAvgAggregateOutputType | null
    _sum: StoreProductSumAggregateOutputType | null
    _min: StoreProductMinAggregateOutputType | null
    _max: StoreProductMaxAggregateOutputType | null
  }

  type GetStoreProductGroupByPayload<T extends StoreProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreProductGroupByOutputType[P]>
            : GetScalarType<T[P], StoreProductGroupByOutputType[P]>
        }
      >
    >


  export type StoreProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    price?: boolean
    image?: boolean
    tag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeProduct"]>



  export type StoreProductSelectScalar = {
    id?: boolean
    name?: boolean
    price?: boolean
    image?: boolean
    tag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
  }

  export type StoreProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "price" | "image" | "tag" | "createdAt" | "updatedAt" | "storeId", ExtArgs["result"]["storeProduct"]>
  export type StoreProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $StoreProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StoreProduct"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      price: string
      image: string
      tag: string | null
      createdAt: Date
      updatedAt: Date
      storeId: number
    }, ExtArgs["result"]["storeProduct"]>
    composites: {}
  }

  type StoreProductGetPayload<S extends boolean | null | undefined | StoreProductDefaultArgs> = $Result.GetResult<Prisma.$StoreProductPayload, S>

  type StoreProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoreProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoreProductCountAggregateInputType | true
    }

  export interface StoreProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StoreProduct'], meta: { name: 'StoreProduct' } }
    /**
     * Find zero or one StoreProduct that matches the filter.
     * @param {StoreProductFindUniqueArgs} args - Arguments to find a StoreProduct
     * @example
     * // Get one StoreProduct
     * const storeProduct = await prisma.storeProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreProductFindUniqueArgs>(args: SelectSubset<T, StoreProductFindUniqueArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StoreProduct that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoreProductFindUniqueOrThrowArgs} args - Arguments to find a StoreProduct
     * @example
     * // Get one StoreProduct
     * const storeProduct = await prisma.storeProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreProductFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoreProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductFindFirstArgs} args - Arguments to find a StoreProduct
     * @example
     * // Get one StoreProduct
     * const storeProduct = await prisma.storeProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreProductFindFirstArgs>(args?: SelectSubset<T, StoreProductFindFirstArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoreProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductFindFirstOrThrowArgs} args - Arguments to find a StoreProduct
     * @example
     * // Get one StoreProduct
     * const storeProduct = await prisma.storeProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreProductFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StoreProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StoreProducts
     * const storeProducts = await prisma.storeProduct.findMany()
     * 
     * // Get first 10 StoreProducts
     * const storeProducts = await prisma.storeProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeProductWithIdOnly = await prisma.storeProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreProductFindManyArgs>(args?: SelectSubset<T, StoreProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StoreProduct.
     * @param {StoreProductCreateArgs} args - Arguments to create a StoreProduct.
     * @example
     * // Create one StoreProduct
     * const StoreProduct = await prisma.storeProduct.create({
     *   data: {
     *     // ... data to create a StoreProduct
     *   }
     * })
     * 
     */
    create<T extends StoreProductCreateArgs>(args: SelectSubset<T, StoreProductCreateArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StoreProducts.
     * @param {StoreProductCreateManyArgs} args - Arguments to create many StoreProducts.
     * @example
     * // Create many StoreProducts
     * const storeProduct = await prisma.storeProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreProductCreateManyArgs>(args?: SelectSubset<T, StoreProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a StoreProduct.
     * @param {StoreProductDeleteArgs} args - Arguments to delete one StoreProduct.
     * @example
     * // Delete one StoreProduct
     * const StoreProduct = await prisma.storeProduct.delete({
     *   where: {
     *     // ... filter to delete one StoreProduct
     *   }
     * })
     * 
     */
    delete<T extends StoreProductDeleteArgs>(args: SelectSubset<T, StoreProductDeleteArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StoreProduct.
     * @param {StoreProductUpdateArgs} args - Arguments to update one StoreProduct.
     * @example
     * // Update one StoreProduct
     * const storeProduct = await prisma.storeProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreProductUpdateArgs>(args: SelectSubset<T, StoreProductUpdateArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StoreProducts.
     * @param {StoreProductDeleteManyArgs} args - Arguments to filter StoreProducts to delete.
     * @example
     * // Delete a few StoreProducts
     * const { count } = await prisma.storeProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreProductDeleteManyArgs>(args?: SelectSubset<T, StoreProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoreProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StoreProducts
     * const storeProduct = await prisma.storeProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreProductUpdateManyArgs>(args: SelectSubset<T, StoreProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StoreProduct.
     * @param {StoreProductUpsertArgs} args - Arguments to update or create a StoreProduct.
     * @example
     * // Update or create a StoreProduct
     * const storeProduct = await prisma.storeProduct.upsert({
     *   create: {
     *     // ... data to create a StoreProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StoreProduct we want to update
     *   }
     * })
     */
    upsert<T extends StoreProductUpsertArgs>(args: SelectSubset<T, StoreProductUpsertArgs<ExtArgs>>): Prisma__StoreProductClient<$Result.GetResult<Prisma.$StoreProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StoreProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductCountArgs} args - Arguments to filter StoreProducts to count.
     * @example
     * // Count the number of StoreProducts
     * const count = await prisma.storeProduct.count({
     *   where: {
     *     // ... the filter for the StoreProducts we want to count
     *   }
     * })
    **/
    count<T extends StoreProductCountArgs>(
      args?: Subset<T, StoreProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StoreProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreProductAggregateArgs>(args: Subset<T, StoreProductAggregateArgs>): Prisma.PrismaPromise<GetStoreProductAggregateType<T>>

    /**
     * Group by StoreProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreProductGroupByArgs['orderBy'] }
        : { orderBy?: StoreProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StoreProduct model
   */
  readonly fields: StoreProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StoreProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StoreProduct model
   */
  interface StoreProductFieldRefs {
    readonly id: FieldRef<"StoreProduct", 'String'>
    readonly name: FieldRef<"StoreProduct", 'String'>
    readonly price: FieldRef<"StoreProduct", 'String'>
    readonly image: FieldRef<"StoreProduct", 'String'>
    readonly tag: FieldRef<"StoreProduct", 'String'>
    readonly createdAt: FieldRef<"StoreProduct", 'DateTime'>
    readonly updatedAt: FieldRef<"StoreProduct", 'DateTime'>
    readonly storeId: FieldRef<"StoreProduct", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * StoreProduct findUnique
   */
  export type StoreProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * Filter, which StoreProduct to fetch.
     */
    where: StoreProductWhereUniqueInput
  }

  /**
   * StoreProduct findUniqueOrThrow
   */
  export type StoreProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * Filter, which StoreProduct to fetch.
     */
    where: StoreProductWhereUniqueInput
  }

  /**
   * StoreProduct findFirst
   */
  export type StoreProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * Filter, which StoreProduct to fetch.
     */
    where?: StoreProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreProducts to fetch.
     */
    orderBy?: StoreProductOrderByWithRelationInput | StoreProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreProducts.
     */
    cursor?: StoreProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreProducts.
     */
    distinct?: StoreProductScalarFieldEnum | StoreProductScalarFieldEnum[]
  }

  /**
   * StoreProduct findFirstOrThrow
   */
  export type StoreProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * Filter, which StoreProduct to fetch.
     */
    where?: StoreProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreProducts to fetch.
     */
    orderBy?: StoreProductOrderByWithRelationInput | StoreProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreProducts.
     */
    cursor?: StoreProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreProducts.
     */
    distinct?: StoreProductScalarFieldEnum | StoreProductScalarFieldEnum[]
  }

  /**
   * StoreProduct findMany
   */
  export type StoreProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * Filter, which StoreProducts to fetch.
     */
    where?: StoreProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreProducts to fetch.
     */
    orderBy?: StoreProductOrderByWithRelationInput | StoreProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StoreProducts.
     */
    cursor?: StoreProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreProducts.
     */
    skip?: number
    distinct?: StoreProductScalarFieldEnum | StoreProductScalarFieldEnum[]
  }

  /**
   * StoreProduct create
   */
  export type StoreProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * The data needed to create a StoreProduct.
     */
    data: XOR<StoreProductCreateInput, StoreProductUncheckedCreateInput>
  }

  /**
   * StoreProduct createMany
   */
  export type StoreProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StoreProducts.
     */
    data: StoreProductCreateManyInput | StoreProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StoreProduct update
   */
  export type StoreProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * The data needed to update a StoreProduct.
     */
    data: XOR<StoreProductUpdateInput, StoreProductUncheckedUpdateInput>
    /**
     * Choose, which StoreProduct to update.
     */
    where: StoreProductWhereUniqueInput
  }

  /**
   * StoreProduct updateMany
   */
  export type StoreProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StoreProducts.
     */
    data: XOR<StoreProductUpdateManyMutationInput, StoreProductUncheckedUpdateManyInput>
    /**
     * Filter which StoreProducts to update
     */
    where?: StoreProductWhereInput
    /**
     * Limit how many StoreProducts to update.
     */
    limit?: number
  }

  /**
   * StoreProduct upsert
   */
  export type StoreProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * The filter to search for the StoreProduct to update in case it exists.
     */
    where: StoreProductWhereUniqueInput
    /**
     * In case the StoreProduct found by the `where` argument doesn't exist, create a new StoreProduct with this data.
     */
    create: XOR<StoreProductCreateInput, StoreProductUncheckedCreateInput>
    /**
     * In case the StoreProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreProductUpdateInput, StoreProductUncheckedUpdateInput>
  }

  /**
   * StoreProduct delete
   */
  export type StoreProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
    /**
     * Filter which StoreProduct to delete.
     */
    where: StoreProductWhereUniqueInput
  }

  /**
   * StoreProduct deleteMany
   */
  export type StoreProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreProducts to delete
     */
    where?: StoreProductWhereInput
    /**
     * Limit how many StoreProducts to delete.
     */
    limit?: number
  }

  /**
   * StoreProduct without action
   */
  export type StoreProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreProduct
     */
    select?: StoreProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreProduct
     */
    omit?: StoreProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreProductInclude<ExtArgs> | null
  }


  /**
   * Model StoreRating
   */

  export type AggregateStoreRating = {
    _count: StoreRatingCountAggregateOutputType | null
    _avg: StoreRatingAvgAggregateOutputType | null
    _sum: StoreRatingSumAggregateOutputType | null
    _min: StoreRatingMinAggregateOutputType | null
    _max: StoreRatingMaxAggregateOutputType | null
  }

  export type StoreRatingAvgAggregateOutputType = {
    id: number | null
    rating: Decimal | null
    storeId: number | null
  }

  export type StoreRatingSumAggregateOutputType = {
    id: number | null
    rating: Decimal | null
    storeId: number | null
  }

  export type StoreRatingMinAggregateOutputType = {
    id: number | null
    userId: string | null
    rating: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
    storeId: number | null
  }

  export type StoreRatingMaxAggregateOutputType = {
    id: number | null
    userId: string | null
    rating: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
    storeId: number | null
  }

  export type StoreRatingCountAggregateOutputType = {
    id: number
    userId: number
    rating: number
    createdAt: number
    updatedAt: number
    storeId: number
    _all: number
  }


  export type StoreRatingAvgAggregateInputType = {
    id?: true
    rating?: true
    storeId?: true
  }

  export type StoreRatingSumAggregateInputType = {
    id?: true
    rating?: true
    storeId?: true
  }

  export type StoreRatingMinAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
  }

  export type StoreRatingMaxAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
  }

  export type StoreRatingCountAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
    _all?: true
  }

  export type StoreRatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreRating to aggregate.
     */
    where?: StoreRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreRatings to fetch.
     */
    orderBy?: StoreRatingOrderByWithRelationInput | StoreRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StoreRatings
    **/
    _count?: true | StoreRatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoreRatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoreRatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreRatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreRatingMaxAggregateInputType
  }

  export type GetStoreRatingAggregateType<T extends StoreRatingAggregateArgs> = {
        [P in keyof T & keyof AggregateStoreRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoreRating[P]>
      : GetScalarType<T[P], AggregateStoreRating[P]>
  }




  export type StoreRatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreRatingWhereInput
    orderBy?: StoreRatingOrderByWithAggregationInput | StoreRatingOrderByWithAggregationInput[]
    by: StoreRatingScalarFieldEnum[] | StoreRatingScalarFieldEnum
    having?: StoreRatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreRatingCountAggregateInputType | true
    _avg?: StoreRatingAvgAggregateInputType
    _sum?: StoreRatingSumAggregateInputType
    _min?: StoreRatingMinAggregateInputType
    _max?: StoreRatingMaxAggregateInputType
  }

  export type StoreRatingGroupByOutputType = {
    id: number
    userId: string
    rating: Decimal
    createdAt: Date
    updatedAt: Date
    storeId: number
    _count: StoreRatingCountAggregateOutputType | null
    _avg: StoreRatingAvgAggregateOutputType | null
    _sum: StoreRatingSumAggregateOutputType | null
    _min: StoreRatingMinAggregateOutputType | null
    _max: StoreRatingMaxAggregateOutputType | null
  }

  type GetStoreRatingGroupByPayload<T extends StoreRatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreRatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreRatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreRatingGroupByOutputType[P]>
            : GetScalarType<T[P], StoreRatingGroupByOutputType[P]>
        }
      >
    >


  export type StoreRatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeRating"]>



  export type StoreRatingSelectScalar = {
    id?: boolean
    userId?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
  }

  export type StoreRatingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "rating" | "createdAt" | "updatedAt" | "storeId", ExtArgs["result"]["storeRating"]>
  export type StoreRatingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $StoreRatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StoreRating"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string
      rating: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
      storeId: number
    }, ExtArgs["result"]["storeRating"]>
    composites: {}
  }

  type StoreRatingGetPayload<S extends boolean | null | undefined | StoreRatingDefaultArgs> = $Result.GetResult<Prisma.$StoreRatingPayload, S>

  type StoreRatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoreRatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoreRatingCountAggregateInputType | true
    }

  export interface StoreRatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StoreRating'], meta: { name: 'StoreRating' } }
    /**
     * Find zero or one StoreRating that matches the filter.
     * @param {StoreRatingFindUniqueArgs} args - Arguments to find a StoreRating
     * @example
     * // Get one StoreRating
     * const storeRating = await prisma.storeRating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreRatingFindUniqueArgs>(args: SelectSubset<T, StoreRatingFindUniqueArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StoreRating that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoreRatingFindUniqueOrThrowArgs} args - Arguments to find a StoreRating
     * @example
     * // Get one StoreRating
     * const storeRating = await prisma.storeRating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreRatingFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreRatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoreRating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingFindFirstArgs} args - Arguments to find a StoreRating
     * @example
     * // Get one StoreRating
     * const storeRating = await prisma.storeRating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreRatingFindFirstArgs>(args?: SelectSubset<T, StoreRatingFindFirstArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoreRating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingFindFirstOrThrowArgs} args - Arguments to find a StoreRating
     * @example
     * // Get one StoreRating
     * const storeRating = await prisma.storeRating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreRatingFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreRatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StoreRatings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StoreRatings
     * const storeRatings = await prisma.storeRating.findMany()
     * 
     * // Get first 10 StoreRatings
     * const storeRatings = await prisma.storeRating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeRatingWithIdOnly = await prisma.storeRating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreRatingFindManyArgs>(args?: SelectSubset<T, StoreRatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StoreRating.
     * @param {StoreRatingCreateArgs} args - Arguments to create a StoreRating.
     * @example
     * // Create one StoreRating
     * const StoreRating = await prisma.storeRating.create({
     *   data: {
     *     // ... data to create a StoreRating
     *   }
     * })
     * 
     */
    create<T extends StoreRatingCreateArgs>(args: SelectSubset<T, StoreRatingCreateArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StoreRatings.
     * @param {StoreRatingCreateManyArgs} args - Arguments to create many StoreRatings.
     * @example
     * // Create many StoreRatings
     * const storeRating = await prisma.storeRating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreRatingCreateManyArgs>(args?: SelectSubset<T, StoreRatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a StoreRating.
     * @param {StoreRatingDeleteArgs} args - Arguments to delete one StoreRating.
     * @example
     * // Delete one StoreRating
     * const StoreRating = await prisma.storeRating.delete({
     *   where: {
     *     // ... filter to delete one StoreRating
     *   }
     * })
     * 
     */
    delete<T extends StoreRatingDeleteArgs>(args: SelectSubset<T, StoreRatingDeleteArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StoreRating.
     * @param {StoreRatingUpdateArgs} args - Arguments to update one StoreRating.
     * @example
     * // Update one StoreRating
     * const storeRating = await prisma.storeRating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreRatingUpdateArgs>(args: SelectSubset<T, StoreRatingUpdateArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StoreRatings.
     * @param {StoreRatingDeleteManyArgs} args - Arguments to filter StoreRatings to delete.
     * @example
     * // Delete a few StoreRatings
     * const { count } = await prisma.storeRating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreRatingDeleteManyArgs>(args?: SelectSubset<T, StoreRatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoreRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StoreRatings
     * const storeRating = await prisma.storeRating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreRatingUpdateManyArgs>(args: SelectSubset<T, StoreRatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StoreRating.
     * @param {StoreRatingUpsertArgs} args - Arguments to update or create a StoreRating.
     * @example
     * // Update or create a StoreRating
     * const storeRating = await prisma.storeRating.upsert({
     *   create: {
     *     // ... data to create a StoreRating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StoreRating we want to update
     *   }
     * })
     */
    upsert<T extends StoreRatingUpsertArgs>(args: SelectSubset<T, StoreRatingUpsertArgs<ExtArgs>>): Prisma__StoreRatingClient<$Result.GetResult<Prisma.$StoreRatingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StoreRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingCountArgs} args - Arguments to filter StoreRatings to count.
     * @example
     * // Count the number of StoreRatings
     * const count = await prisma.storeRating.count({
     *   where: {
     *     // ... the filter for the StoreRatings we want to count
     *   }
     * })
    **/
    count<T extends StoreRatingCountArgs>(
      args?: Subset<T, StoreRatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreRatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StoreRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreRatingAggregateArgs>(args: Subset<T, StoreRatingAggregateArgs>): Prisma.PrismaPromise<GetStoreRatingAggregateType<T>>

    /**
     * Group by StoreRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreRatingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreRatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreRatingGroupByArgs['orderBy'] }
        : { orderBy?: StoreRatingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreRatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StoreRating model
   */
  readonly fields: StoreRatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StoreRating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreRatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StoreRating model
   */
  interface StoreRatingFieldRefs {
    readonly id: FieldRef<"StoreRating", 'Int'>
    readonly userId: FieldRef<"StoreRating", 'String'>
    readonly rating: FieldRef<"StoreRating", 'Decimal'>
    readonly createdAt: FieldRef<"StoreRating", 'DateTime'>
    readonly updatedAt: FieldRef<"StoreRating", 'DateTime'>
    readonly storeId: FieldRef<"StoreRating", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * StoreRating findUnique
   */
  export type StoreRatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * Filter, which StoreRating to fetch.
     */
    where: StoreRatingWhereUniqueInput
  }

  /**
   * StoreRating findUniqueOrThrow
   */
  export type StoreRatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * Filter, which StoreRating to fetch.
     */
    where: StoreRatingWhereUniqueInput
  }

  /**
   * StoreRating findFirst
   */
  export type StoreRatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * Filter, which StoreRating to fetch.
     */
    where?: StoreRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreRatings to fetch.
     */
    orderBy?: StoreRatingOrderByWithRelationInput | StoreRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreRatings.
     */
    cursor?: StoreRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreRatings.
     */
    distinct?: StoreRatingScalarFieldEnum | StoreRatingScalarFieldEnum[]
  }

  /**
   * StoreRating findFirstOrThrow
   */
  export type StoreRatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * Filter, which StoreRating to fetch.
     */
    where?: StoreRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreRatings to fetch.
     */
    orderBy?: StoreRatingOrderByWithRelationInput | StoreRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreRatings.
     */
    cursor?: StoreRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreRatings.
     */
    distinct?: StoreRatingScalarFieldEnum | StoreRatingScalarFieldEnum[]
  }

  /**
   * StoreRating findMany
   */
  export type StoreRatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * Filter, which StoreRatings to fetch.
     */
    where?: StoreRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreRatings to fetch.
     */
    orderBy?: StoreRatingOrderByWithRelationInput | StoreRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StoreRatings.
     */
    cursor?: StoreRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreRatings.
     */
    skip?: number
    distinct?: StoreRatingScalarFieldEnum | StoreRatingScalarFieldEnum[]
  }

  /**
   * StoreRating create
   */
  export type StoreRatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * The data needed to create a StoreRating.
     */
    data: XOR<StoreRatingCreateInput, StoreRatingUncheckedCreateInput>
  }

  /**
   * StoreRating createMany
   */
  export type StoreRatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StoreRatings.
     */
    data: StoreRatingCreateManyInput | StoreRatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StoreRating update
   */
  export type StoreRatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * The data needed to update a StoreRating.
     */
    data: XOR<StoreRatingUpdateInput, StoreRatingUncheckedUpdateInput>
    /**
     * Choose, which StoreRating to update.
     */
    where: StoreRatingWhereUniqueInput
  }

  /**
   * StoreRating updateMany
   */
  export type StoreRatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StoreRatings.
     */
    data: XOR<StoreRatingUpdateManyMutationInput, StoreRatingUncheckedUpdateManyInput>
    /**
     * Filter which StoreRatings to update
     */
    where?: StoreRatingWhereInput
    /**
     * Limit how many StoreRatings to update.
     */
    limit?: number
  }

  /**
   * StoreRating upsert
   */
  export type StoreRatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * The filter to search for the StoreRating to update in case it exists.
     */
    where: StoreRatingWhereUniqueInput
    /**
     * In case the StoreRating found by the `where` argument doesn't exist, create a new StoreRating with this data.
     */
    create: XOR<StoreRatingCreateInput, StoreRatingUncheckedCreateInput>
    /**
     * In case the StoreRating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreRatingUpdateInput, StoreRatingUncheckedUpdateInput>
  }

  /**
   * StoreRating delete
   */
  export type StoreRatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
    /**
     * Filter which StoreRating to delete.
     */
    where: StoreRatingWhereUniqueInput
  }

  /**
   * StoreRating deleteMany
   */
  export type StoreRatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreRatings to delete
     */
    where?: StoreRatingWhereInput
    /**
     * Limit how many StoreRatings to delete.
     */
    limit?: number
  }

  /**
   * StoreRating without action
   */
  export type StoreRatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreRating
     */
    select?: StoreRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreRating
     */
    omit?: StoreRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreRatingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StoreScalarFieldEnum: {
    id: 'id',
    ownerUserId: 'ownerUserId',
    name: 'name',
    location: 'location',
    rating: 'rating',
    image: 'image',
    badges: 'badges',
    delivery: 'delivery',
    minOrderRs: 'minOrderRs',
    openingTime: 'openingTime',
    closingTime: 'closingTime',
    phoneNumber: 'phoneNumber',
    searchCount: 'searchCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StoreScalarFieldEnum = (typeof StoreScalarFieldEnum)[keyof typeof StoreScalarFieldEnum]


  export const StoreProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    image: 'image',
    tag: 'tag',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    storeId: 'storeId'
  };

  export type StoreProductScalarFieldEnum = (typeof StoreProductScalarFieldEnum)[keyof typeof StoreProductScalarFieldEnum]


  export const StoreRatingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    rating: 'rating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    storeId: 'storeId'
  };

  export type StoreRatingScalarFieldEnum = (typeof StoreRatingScalarFieldEnum)[keyof typeof StoreRatingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const StoreOrderByRelevanceFieldEnum: {
    ownerUserId: 'ownerUserId',
    name: 'name',
    location: 'location',
    rating: 'rating',
    image: 'image',
    delivery: 'delivery',
    minOrderRs: 'minOrderRs',
    openingTime: 'openingTime',
    closingTime: 'closingTime',
    phoneNumber: 'phoneNumber'
  };

  export type StoreOrderByRelevanceFieldEnum = (typeof StoreOrderByRelevanceFieldEnum)[keyof typeof StoreOrderByRelevanceFieldEnum]


  export const StoreProductOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    price: 'price',
    image: 'image',
    tag: 'tag'
  };

  export type StoreProductOrderByRelevanceFieldEnum = (typeof StoreProductOrderByRelevanceFieldEnum)[keyof typeof StoreProductOrderByRelevanceFieldEnum]


  export const StoreRatingOrderByRelevanceFieldEnum: {
    userId: 'userId'
  };

  export type StoreRatingOrderByRelevanceFieldEnum = (typeof StoreRatingOrderByRelevanceFieldEnum)[keyof typeof StoreRatingOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type StoreWhereInput = {
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    id?: IntFilter<"Store"> | number
    ownerUserId?: StringFilter<"Store"> | string
    name?: StringFilter<"Store"> | string
    location?: StringFilter<"Store"> | string
    rating?: StringFilter<"Store"> | string
    image?: StringFilter<"Store"> | string
    badges?: JsonNullableFilter<"Store">
    delivery?: StringFilter<"Store"> | string
    minOrderRs?: StringFilter<"Store"> | string
    openingTime?: StringFilter<"Store"> | string
    closingTime?: StringFilter<"Store"> | string
    phoneNumber?: StringFilter<"Store"> | string
    searchCount?: IntFilter<"Store"> | number
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    products?: StoreProductListRelationFilter
    ratings?: StoreRatingListRelationFilter
  }

  export type StoreOrderByWithRelationInput = {
    id?: SortOrder
    ownerUserId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    rating?: SortOrder
    image?: SortOrder
    badges?: SortOrderInput | SortOrder
    delivery?: SortOrder
    minOrderRs?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    phoneNumber?: SortOrder
    searchCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    products?: StoreProductOrderByRelationAggregateInput
    ratings?: StoreRatingOrderByRelationAggregateInput
    _relevance?: StoreOrderByRelevanceInput
  }

  export type StoreWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    ownerUserId?: string
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    name?: StringFilter<"Store"> | string
    location?: StringFilter<"Store"> | string
    rating?: StringFilter<"Store"> | string
    image?: StringFilter<"Store"> | string
    badges?: JsonNullableFilter<"Store">
    delivery?: StringFilter<"Store"> | string
    minOrderRs?: StringFilter<"Store"> | string
    openingTime?: StringFilter<"Store"> | string
    closingTime?: StringFilter<"Store"> | string
    phoneNumber?: StringFilter<"Store"> | string
    searchCount?: IntFilter<"Store"> | number
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    products?: StoreProductListRelationFilter
    ratings?: StoreRatingListRelationFilter
  }, "id" | "ownerUserId">

  export type StoreOrderByWithAggregationInput = {
    id?: SortOrder
    ownerUserId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    rating?: SortOrder
    image?: SortOrder
    badges?: SortOrderInput | SortOrder
    delivery?: SortOrder
    minOrderRs?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    phoneNumber?: SortOrder
    searchCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StoreCountOrderByAggregateInput
    _avg?: StoreAvgOrderByAggregateInput
    _max?: StoreMaxOrderByAggregateInput
    _min?: StoreMinOrderByAggregateInput
    _sum?: StoreSumOrderByAggregateInput
  }

  export type StoreScalarWhereWithAggregatesInput = {
    AND?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    OR?: StoreScalarWhereWithAggregatesInput[]
    NOT?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Store"> | number
    ownerUserId?: StringWithAggregatesFilter<"Store"> | string
    name?: StringWithAggregatesFilter<"Store"> | string
    location?: StringWithAggregatesFilter<"Store"> | string
    rating?: StringWithAggregatesFilter<"Store"> | string
    image?: StringWithAggregatesFilter<"Store"> | string
    badges?: JsonNullableWithAggregatesFilter<"Store">
    delivery?: StringWithAggregatesFilter<"Store"> | string
    minOrderRs?: StringWithAggregatesFilter<"Store"> | string
    openingTime?: StringWithAggregatesFilter<"Store"> | string
    closingTime?: StringWithAggregatesFilter<"Store"> | string
    phoneNumber?: StringWithAggregatesFilter<"Store"> | string
    searchCount?: IntWithAggregatesFilter<"Store"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
  }

  export type StoreProductWhereInput = {
    AND?: StoreProductWhereInput | StoreProductWhereInput[]
    OR?: StoreProductWhereInput[]
    NOT?: StoreProductWhereInput | StoreProductWhereInput[]
    id?: StringFilter<"StoreProduct"> | string
    name?: StringFilter<"StoreProduct"> | string
    price?: StringFilter<"StoreProduct"> | string
    image?: StringFilter<"StoreProduct"> | string
    tag?: StringNullableFilter<"StoreProduct"> | string | null
    createdAt?: DateTimeFilter<"StoreProduct"> | Date | string
    updatedAt?: DateTimeFilter<"StoreProduct"> | Date | string
    storeId?: IntFilter<"StoreProduct"> | number
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
  }

  export type StoreProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    image?: SortOrder
    tag?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    store?: StoreOrderByWithRelationInput
    _relevance?: StoreProductOrderByRelevanceInput
  }

  export type StoreProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StoreProductWhereInput | StoreProductWhereInput[]
    OR?: StoreProductWhereInput[]
    NOT?: StoreProductWhereInput | StoreProductWhereInput[]
    name?: StringFilter<"StoreProduct"> | string
    price?: StringFilter<"StoreProduct"> | string
    image?: StringFilter<"StoreProduct"> | string
    tag?: StringNullableFilter<"StoreProduct"> | string | null
    createdAt?: DateTimeFilter<"StoreProduct"> | Date | string
    updatedAt?: DateTimeFilter<"StoreProduct"> | Date | string
    storeId?: IntFilter<"StoreProduct"> | number
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
  }, "id">

  export type StoreProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    image?: SortOrder
    tag?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    _count?: StoreProductCountOrderByAggregateInput
    _avg?: StoreProductAvgOrderByAggregateInput
    _max?: StoreProductMaxOrderByAggregateInput
    _min?: StoreProductMinOrderByAggregateInput
    _sum?: StoreProductSumOrderByAggregateInput
  }

  export type StoreProductScalarWhereWithAggregatesInput = {
    AND?: StoreProductScalarWhereWithAggregatesInput | StoreProductScalarWhereWithAggregatesInput[]
    OR?: StoreProductScalarWhereWithAggregatesInput[]
    NOT?: StoreProductScalarWhereWithAggregatesInput | StoreProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StoreProduct"> | string
    name?: StringWithAggregatesFilter<"StoreProduct"> | string
    price?: StringWithAggregatesFilter<"StoreProduct"> | string
    image?: StringWithAggregatesFilter<"StoreProduct"> | string
    tag?: StringNullableWithAggregatesFilter<"StoreProduct"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StoreProduct"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StoreProduct"> | Date | string
    storeId?: IntWithAggregatesFilter<"StoreProduct"> | number
  }

  export type StoreRatingWhereInput = {
    AND?: StoreRatingWhereInput | StoreRatingWhereInput[]
    OR?: StoreRatingWhereInput[]
    NOT?: StoreRatingWhereInput | StoreRatingWhereInput[]
    id?: IntFilter<"StoreRating"> | number
    userId?: StringFilter<"StoreRating"> | string
    rating?: DecimalFilter<"StoreRating"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"StoreRating"> | Date | string
    updatedAt?: DateTimeFilter<"StoreRating"> | Date | string
    storeId?: IntFilter<"StoreRating"> | number
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
  }

  export type StoreRatingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    store?: StoreOrderByWithRelationInput
    _relevance?: StoreRatingOrderByRelevanceInput
  }

  export type StoreRatingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    storeId_userId?: StoreRatingStoreIdUserIdCompoundUniqueInput
    AND?: StoreRatingWhereInput | StoreRatingWhereInput[]
    OR?: StoreRatingWhereInput[]
    NOT?: StoreRatingWhereInput | StoreRatingWhereInput[]
    userId?: StringFilter<"StoreRating"> | string
    rating?: DecimalFilter<"StoreRating"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"StoreRating"> | Date | string
    updatedAt?: DateTimeFilter<"StoreRating"> | Date | string
    storeId?: IntFilter<"StoreRating"> | number
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
  }, "id" | "storeId_userId">

  export type StoreRatingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    _count?: StoreRatingCountOrderByAggregateInput
    _avg?: StoreRatingAvgOrderByAggregateInput
    _max?: StoreRatingMaxOrderByAggregateInput
    _min?: StoreRatingMinOrderByAggregateInput
    _sum?: StoreRatingSumOrderByAggregateInput
  }

  export type StoreRatingScalarWhereWithAggregatesInput = {
    AND?: StoreRatingScalarWhereWithAggregatesInput | StoreRatingScalarWhereWithAggregatesInput[]
    OR?: StoreRatingScalarWhereWithAggregatesInput[]
    NOT?: StoreRatingScalarWhereWithAggregatesInput | StoreRatingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"StoreRating"> | number
    userId?: StringWithAggregatesFilter<"StoreRating"> | string
    rating?: DecimalWithAggregatesFilter<"StoreRating"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"StoreRating"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StoreRating"> | Date | string
    storeId?: IntWithAggregatesFilter<"StoreRating"> | number
  }

  export type StoreCreateInput = {
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: StoreProductCreateNestedManyWithoutStoreInput
    ratings?: StoreRatingCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateInput = {
    id?: number
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: StoreProductUncheckedCreateNestedManyWithoutStoreInput
    ratings?: StoreRatingUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreUpdateInput = {
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: StoreProductUpdateManyWithoutStoreNestedInput
    ratings?: StoreRatingUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: StoreProductUncheckedUpdateManyWithoutStoreNestedInput
    ratings?: StoreRatingUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateManyInput = {
    id?: number
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreUpdateManyMutationInput = {
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreProductCreateInput = {
    id?: string
    name: string
    price: string
    image: string
    tag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutProductsInput
  }

  export type StoreProductUncheckedCreateInput = {
    id?: string
    name: string
    price: string
    image: string
    tag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId: number
  }

  export type StoreProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutProductsNestedInput
  }

  export type StoreProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
  }

  export type StoreProductCreateManyInput = {
    id?: string
    name: string
    price: string
    image: string
    tag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId: number
  }

  export type StoreProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
  }

  export type StoreRatingCreateInput = {
    userId: string
    rating: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutRatingsInput
  }

  export type StoreRatingUncheckedCreateInput = {
    id?: number
    userId: string
    rating: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId: number
  }

  export type StoreRatingUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type StoreRatingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
  }

  export type StoreRatingCreateManyInput = {
    id?: number
    userId: string
    rating: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId: number
  }

  export type StoreRatingUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreRatingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StoreProductListRelationFilter = {
    every?: StoreProductWhereInput
    some?: StoreProductWhereInput
    none?: StoreProductWhereInput
  }

  export type StoreRatingListRelationFilter = {
    every?: StoreRatingWhereInput
    some?: StoreRatingWhereInput
    none?: StoreRatingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StoreProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreRatingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreOrderByRelevanceInput = {
    fields: StoreOrderByRelevanceFieldEnum | StoreOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StoreCountOrderByAggregateInput = {
    id?: SortOrder
    ownerUserId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    rating?: SortOrder
    image?: SortOrder
    badges?: SortOrder
    delivery?: SortOrder
    minOrderRs?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    phoneNumber?: SortOrder
    searchCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreAvgOrderByAggregateInput = {
    id?: SortOrder
    searchCount?: SortOrder
  }

  export type StoreMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerUserId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    rating?: SortOrder
    image?: SortOrder
    delivery?: SortOrder
    minOrderRs?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    phoneNumber?: SortOrder
    searchCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMinOrderByAggregateInput = {
    id?: SortOrder
    ownerUserId?: SortOrder
    name?: SortOrder
    location?: SortOrder
    rating?: SortOrder
    image?: SortOrder
    delivery?: SortOrder
    minOrderRs?: SortOrder
    openingTime?: SortOrder
    closingTime?: SortOrder
    phoneNumber?: SortOrder
    searchCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreSumOrderByAggregateInput = {
    id?: SortOrder
    searchCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StoreScalarRelationFilter = {
    is?: StoreWhereInput
    isNot?: StoreWhereInput
  }

  export type StoreProductOrderByRelevanceInput = {
    fields: StoreProductOrderByRelevanceFieldEnum | StoreProductOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StoreProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    image?: SortOrder
    tag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
  }

  export type StoreProductAvgOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type StoreProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    image?: SortOrder
    tag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
  }

  export type StoreProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    price?: SortOrder
    image?: SortOrder
    tag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
  }

  export type StoreProductSumOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type StoreRatingOrderByRelevanceInput = {
    fields: StoreRatingOrderByRelevanceFieldEnum | StoreRatingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StoreRatingStoreIdUserIdCompoundUniqueInput = {
    storeId: number
    userId: string
  }

  export type StoreRatingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
  }

  export type StoreRatingAvgOrderByAggregateInput = {
    id?: SortOrder
    rating?: SortOrder
    storeId?: SortOrder
  }

  export type StoreRatingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
  }

  export type StoreRatingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
  }

  export type StoreRatingSumOrderByAggregateInput = {
    id?: SortOrder
    rating?: SortOrder
    storeId?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type StoreProductCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreProductCreateWithoutStoreInput, StoreProductUncheckedCreateWithoutStoreInput> | StoreProductCreateWithoutStoreInput[] | StoreProductUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreProductCreateOrConnectWithoutStoreInput | StoreProductCreateOrConnectWithoutStoreInput[]
    createMany?: StoreProductCreateManyStoreInputEnvelope
    connect?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
  }

  export type StoreRatingCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreRatingCreateWithoutStoreInput, StoreRatingUncheckedCreateWithoutStoreInput> | StoreRatingCreateWithoutStoreInput[] | StoreRatingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreRatingCreateOrConnectWithoutStoreInput | StoreRatingCreateOrConnectWithoutStoreInput[]
    createMany?: StoreRatingCreateManyStoreInputEnvelope
    connect?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
  }

  export type StoreProductUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreProductCreateWithoutStoreInput, StoreProductUncheckedCreateWithoutStoreInput> | StoreProductCreateWithoutStoreInput[] | StoreProductUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreProductCreateOrConnectWithoutStoreInput | StoreProductCreateOrConnectWithoutStoreInput[]
    createMany?: StoreProductCreateManyStoreInputEnvelope
    connect?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
  }

  export type StoreRatingUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreRatingCreateWithoutStoreInput, StoreRatingUncheckedCreateWithoutStoreInput> | StoreRatingCreateWithoutStoreInput[] | StoreRatingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreRatingCreateOrConnectWithoutStoreInput | StoreRatingCreateOrConnectWithoutStoreInput[]
    createMany?: StoreRatingCreateManyStoreInputEnvelope
    connect?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StoreProductUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreProductCreateWithoutStoreInput, StoreProductUncheckedCreateWithoutStoreInput> | StoreProductCreateWithoutStoreInput[] | StoreProductUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreProductCreateOrConnectWithoutStoreInput | StoreProductCreateOrConnectWithoutStoreInput[]
    upsert?: StoreProductUpsertWithWhereUniqueWithoutStoreInput | StoreProductUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreProductCreateManyStoreInputEnvelope
    set?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    disconnect?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    delete?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    connect?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    update?: StoreProductUpdateWithWhereUniqueWithoutStoreInput | StoreProductUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreProductUpdateManyWithWhereWithoutStoreInput | StoreProductUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreProductScalarWhereInput | StoreProductScalarWhereInput[]
  }

  export type StoreRatingUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreRatingCreateWithoutStoreInput, StoreRatingUncheckedCreateWithoutStoreInput> | StoreRatingCreateWithoutStoreInput[] | StoreRatingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreRatingCreateOrConnectWithoutStoreInput | StoreRatingCreateOrConnectWithoutStoreInput[]
    upsert?: StoreRatingUpsertWithWhereUniqueWithoutStoreInput | StoreRatingUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreRatingCreateManyStoreInputEnvelope
    set?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    disconnect?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    delete?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    connect?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    update?: StoreRatingUpdateWithWhereUniqueWithoutStoreInput | StoreRatingUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreRatingUpdateManyWithWhereWithoutStoreInput | StoreRatingUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreRatingScalarWhereInput | StoreRatingScalarWhereInput[]
  }

  export type StoreProductUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreProductCreateWithoutStoreInput, StoreProductUncheckedCreateWithoutStoreInput> | StoreProductCreateWithoutStoreInput[] | StoreProductUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreProductCreateOrConnectWithoutStoreInput | StoreProductCreateOrConnectWithoutStoreInput[]
    upsert?: StoreProductUpsertWithWhereUniqueWithoutStoreInput | StoreProductUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreProductCreateManyStoreInputEnvelope
    set?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    disconnect?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    delete?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    connect?: StoreProductWhereUniqueInput | StoreProductWhereUniqueInput[]
    update?: StoreProductUpdateWithWhereUniqueWithoutStoreInput | StoreProductUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreProductUpdateManyWithWhereWithoutStoreInput | StoreProductUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreProductScalarWhereInput | StoreProductScalarWhereInput[]
  }

  export type StoreRatingUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreRatingCreateWithoutStoreInput, StoreRatingUncheckedCreateWithoutStoreInput> | StoreRatingCreateWithoutStoreInput[] | StoreRatingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreRatingCreateOrConnectWithoutStoreInput | StoreRatingCreateOrConnectWithoutStoreInput[]
    upsert?: StoreRatingUpsertWithWhereUniqueWithoutStoreInput | StoreRatingUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreRatingCreateManyStoreInputEnvelope
    set?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    disconnect?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    delete?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    connect?: StoreRatingWhereUniqueInput | StoreRatingWhereUniqueInput[]
    update?: StoreRatingUpdateWithWhereUniqueWithoutStoreInput | StoreRatingUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreRatingUpdateManyWithWhereWithoutStoreInput | StoreRatingUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreRatingScalarWhereInput | StoreRatingScalarWhereInput[]
  }

  export type StoreCreateNestedOneWithoutProductsInput = {
    create?: XOR<StoreCreateWithoutProductsInput, StoreUncheckedCreateWithoutProductsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutProductsInput
    connect?: StoreWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StoreUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<StoreCreateWithoutProductsInput, StoreUncheckedCreateWithoutProductsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutProductsInput
    upsert?: StoreUpsertWithoutProductsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutProductsInput, StoreUpdateWithoutProductsInput>, StoreUncheckedUpdateWithoutProductsInput>
  }

  export type StoreCreateNestedOneWithoutRatingsInput = {
    create?: XOR<StoreCreateWithoutRatingsInput, StoreUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutRatingsInput
    connect?: StoreWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type StoreUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<StoreCreateWithoutRatingsInput, StoreUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutRatingsInput
    upsert?: StoreUpsertWithoutRatingsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutRatingsInput, StoreUpdateWithoutRatingsInput>, StoreUncheckedUpdateWithoutRatingsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type StoreProductCreateWithoutStoreInput = {
    id?: string
    name: string
    price: string
    image: string
    tag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreProductUncheckedCreateWithoutStoreInput = {
    id?: string
    name: string
    price: string
    image: string
    tag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreProductCreateOrConnectWithoutStoreInput = {
    where: StoreProductWhereUniqueInput
    create: XOR<StoreProductCreateWithoutStoreInput, StoreProductUncheckedCreateWithoutStoreInput>
  }

  export type StoreProductCreateManyStoreInputEnvelope = {
    data: StoreProductCreateManyStoreInput | StoreProductCreateManyStoreInput[]
    skipDuplicates?: boolean
  }

  export type StoreRatingCreateWithoutStoreInput = {
    userId: string
    rating: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreRatingUncheckedCreateWithoutStoreInput = {
    id?: number
    userId: string
    rating: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreRatingCreateOrConnectWithoutStoreInput = {
    where: StoreRatingWhereUniqueInput
    create: XOR<StoreRatingCreateWithoutStoreInput, StoreRatingUncheckedCreateWithoutStoreInput>
  }

  export type StoreRatingCreateManyStoreInputEnvelope = {
    data: StoreRatingCreateManyStoreInput | StoreRatingCreateManyStoreInput[]
    skipDuplicates?: boolean
  }

  export type StoreProductUpsertWithWhereUniqueWithoutStoreInput = {
    where: StoreProductWhereUniqueInput
    update: XOR<StoreProductUpdateWithoutStoreInput, StoreProductUncheckedUpdateWithoutStoreInput>
    create: XOR<StoreProductCreateWithoutStoreInput, StoreProductUncheckedCreateWithoutStoreInput>
  }

  export type StoreProductUpdateWithWhereUniqueWithoutStoreInput = {
    where: StoreProductWhereUniqueInput
    data: XOR<StoreProductUpdateWithoutStoreInput, StoreProductUncheckedUpdateWithoutStoreInput>
  }

  export type StoreProductUpdateManyWithWhereWithoutStoreInput = {
    where: StoreProductScalarWhereInput
    data: XOR<StoreProductUpdateManyMutationInput, StoreProductUncheckedUpdateManyWithoutStoreInput>
  }

  export type StoreProductScalarWhereInput = {
    AND?: StoreProductScalarWhereInput | StoreProductScalarWhereInput[]
    OR?: StoreProductScalarWhereInput[]
    NOT?: StoreProductScalarWhereInput | StoreProductScalarWhereInput[]
    id?: StringFilter<"StoreProduct"> | string
    name?: StringFilter<"StoreProduct"> | string
    price?: StringFilter<"StoreProduct"> | string
    image?: StringFilter<"StoreProduct"> | string
    tag?: StringNullableFilter<"StoreProduct"> | string | null
    createdAt?: DateTimeFilter<"StoreProduct"> | Date | string
    updatedAt?: DateTimeFilter<"StoreProduct"> | Date | string
    storeId?: IntFilter<"StoreProduct"> | number
  }

  export type StoreRatingUpsertWithWhereUniqueWithoutStoreInput = {
    where: StoreRatingWhereUniqueInput
    update: XOR<StoreRatingUpdateWithoutStoreInput, StoreRatingUncheckedUpdateWithoutStoreInput>
    create: XOR<StoreRatingCreateWithoutStoreInput, StoreRatingUncheckedCreateWithoutStoreInput>
  }

  export type StoreRatingUpdateWithWhereUniqueWithoutStoreInput = {
    where: StoreRatingWhereUniqueInput
    data: XOR<StoreRatingUpdateWithoutStoreInput, StoreRatingUncheckedUpdateWithoutStoreInput>
  }

  export type StoreRatingUpdateManyWithWhereWithoutStoreInput = {
    where: StoreRatingScalarWhereInput
    data: XOR<StoreRatingUpdateManyMutationInput, StoreRatingUncheckedUpdateManyWithoutStoreInput>
  }

  export type StoreRatingScalarWhereInput = {
    AND?: StoreRatingScalarWhereInput | StoreRatingScalarWhereInput[]
    OR?: StoreRatingScalarWhereInput[]
    NOT?: StoreRatingScalarWhereInput | StoreRatingScalarWhereInput[]
    id?: IntFilter<"StoreRating"> | number
    userId?: StringFilter<"StoreRating"> | string
    rating?: DecimalFilter<"StoreRating"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"StoreRating"> | Date | string
    updatedAt?: DateTimeFilter<"StoreRating"> | Date | string
    storeId?: IntFilter<"StoreRating"> | number
  }

  export type StoreCreateWithoutProductsInput = {
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ratings?: StoreRatingCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutProductsInput = {
    id?: number
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ratings?: StoreRatingUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutProductsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutProductsInput, StoreUncheckedCreateWithoutProductsInput>
  }

  export type StoreUpsertWithoutProductsInput = {
    update: XOR<StoreUpdateWithoutProductsInput, StoreUncheckedUpdateWithoutProductsInput>
    create: XOR<StoreCreateWithoutProductsInput, StoreUncheckedCreateWithoutProductsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutProductsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutProductsInput, StoreUncheckedUpdateWithoutProductsInput>
  }

  export type StoreUpdateWithoutProductsInput = {
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: StoreRatingUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: StoreRatingUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateWithoutRatingsInput = {
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: StoreProductCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutRatingsInput = {
    id?: number
    ownerUserId: string
    name: string
    location: string
    rating: string
    image: string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery: string
    minOrderRs: string
    openingTime?: string
    closingTime?: string
    phoneNumber: string
    searchCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: StoreProductUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutRatingsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutRatingsInput, StoreUncheckedCreateWithoutRatingsInput>
  }

  export type StoreUpsertWithoutRatingsInput = {
    update: XOR<StoreUpdateWithoutRatingsInput, StoreUncheckedUpdateWithoutRatingsInput>
    create: XOR<StoreCreateWithoutRatingsInput, StoreUncheckedCreateWithoutRatingsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutRatingsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutRatingsInput, StoreUncheckedUpdateWithoutRatingsInput>
  }

  export type StoreUpdateWithoutRatingsInput = {
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: StoreProductUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutRatingsInput = {
    id?: IntFieldUpdateOperationsInput | number
    ownerUserId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    rating?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    badges?: NullableJsonNullValueInput | InputJsonValue
    delivery?: StringFieldUpdateOperationsInput | string
    minOrderRs?: StringFieldUpdateOperationsInput | string
    openingTime?: StringFieldUpdateOperationsInput | string
    closingTime?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    searchCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: StoreProductUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreProductCreateManyStoreInput = {
    id?: string
    name: string
    price: string
    image: string
    tag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreRatingCreateManyStoreInput = {
    id?: number
    userId: string
    rating: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreProductUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreProductUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreProductUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    price?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    tag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreRatingUpdateWithoutStoreInput = {
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreRatingUncheckedUpdateWithoutStoreInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreRatingUncheckedUpdateManyWithoutStoreInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    rating?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}