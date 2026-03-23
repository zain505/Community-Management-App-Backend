
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
 * Model NewsFeedItem
 * 
 */
export type NewsFeedItem = $Result.DefaultSelection<Prisma.$NewsFeedItemPayload>
/**
 * Model NewsFeedLike
 * 
 */
export type NewsFeedLike = $Result.DefaultSelection<Prisma.$NewsFeedLikePayload>
/**
 * Model NewsFeedMetricState
 * 
 */
export type NewsFeedMetricState = $Result.DefaultSelection<Prisma.$NewsFeedMetricStatePayload>
/**
 * Model NewsFeedSave
 * 
 */
export type NewsFeedSave = $Result.DefaultSelection<Prisma.$NewsFeedSavePayload>

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
  ANNOUNCEMENT_CREATED: 'ANNOUNCEMENT_CREATED',
  ANNOUNCEMENT_UPDATED: 'ANNOUNCEMENT_UPDATED',
  ANNOUNCEMENT_DELETED: 'ANNOUNCEMENT_DELETED',
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
 * // Fetch zero or more NewsFeedItems
 * const newsFeedItems = await prisma.newsFeedItem.findMany()
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
   * // Fetch zero or more NewsFeedItems
   * const newsFeedItems = await prisma.newsFeedItem.findMany()
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
   * `prisma.newsFeedItem`: Exposes CRUD operations for the **NewsFeedItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsFeedItems
    * const newsFeedItems = await prisma.newsFeedItem.findMany()
    * ```
    */
  get newsFeedItem(): Prisma.NewsFeedItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsFeedLike`: Exposes CRUD operations for the **NewsFeedLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsFeedLikes
    * const newsFeedLikes = await prisma.newsFeedLike.findMany()
    * ```
    */
  get newsFeedLike(): Prisma.NewsFeedLikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsFeedMetricState`: Exposes CRUD operations for the **NewsFeedMetricState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsFeedMetricStates
    * const newsFeedMetricStates = await prisma.newsFeedMetricState.findMany()
    * ```
    */
  get newsFeedMetricState(): Prisma.NewsFeedMetricStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsFeedSave`: Exposes CRUD operations for the **NewsFeedSave** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsFeedSaves
    * const newsFeedSaves = await prisma.newsFeedSave.findMany()
    * ```
    */
  get newsFeedSave(): Prisma.NewsFeedSaveDelegate<ExtArgs, ClientOptions>;
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
    NewsFeedItem: 'NewsFeedItem',
    NewsFeedLike: 'NewsFeedLike',
    NewsFeedMetricState: 'NewsFeedMetricState',
    NewsFeedSave: 'NewsFeedSave'
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
      modelProps: "newsFeedItem" | "newsFeedLike" | "newsFeedMetricState" | "newsFeedSave"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      NewsFeedItem: {
        payload: Prisma.$NewsFeedItemPayload<ExtArgs>
        fields: Prisma.NewsFeedItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsFeedItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsFeedItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>
          }
          findFirst: {
            args: Prisma.NewsFeedItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsFeedItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>
          }
          findMany: {
            args: Prisma.NewsFeedItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>[]
          }
          create: {
            args: Prisma.NewsFeedItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>
          }
          createMany: {
            args: Prisma.NewsFeedItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NewsFeedItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>
          }
          update: {
            args: Prisma.NewsFeedItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>
          }
          deleteMany: {
            args: Prisma.NewsFeedItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsFeedItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewsFeedItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedItemPayload>
          }
          aggregate: {
            args: Prisma.NewsFeedItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsFeedItem>
          }
          groupBy: {
            args: Prisma.NewsFeedItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsFeedItemCountArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedItemCountAggregateOutputType> | number
          }
        }
      }
      NewsFeedLike: {
        payload: Prisma.$NewsFeedLikePayload<ExtArgs>
        fields: Prisma.NewsFeedLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsFeedLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsFeedLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>
          }
          findFirst: {
            args: Prisma.NewsFeedLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsFeedLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>
          }
          findMany: {
            args: Prisma.NewsFeedLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>[]
          }
          create: {
            args: Prisma.NewsFeedLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>
          }
          createMany: {
            args: Prisma.NewsFeedLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NewsFeedLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>
          }
          update: {
            args: Prisma.NewsFeedLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>
          }
          deleteMany: {
            args: Prisma.NewsFeedLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsFeedLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewsFeedLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedLikePayload>
          }
          aggregate: {
            args: Prisma.NewsFeedLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsFeedLike>
          }
          groupBy: {
            args: Prisma.NewsFeedLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsFeedLikeCountArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedLikeCountAggregateOutputType> | number
          }
        }
      }
      NewsFeedMetricState: {
        payload: Prisma.$NewsFeedMetricStatePayload<ExtArgs>
        fields: Prisma.NewsFeedMetricStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsFeedMetricStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsFeedMetricStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>
          }
          findFirst: {
            args: Prisma.NewsFeedMetricStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsFeedMetricStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>
          }
          findMany: {
            args: Prisma.NewsFeedMetricStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>[]
          }
          create: {
            args: Prisma.NewsFeedMetricStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>
          }
          createMany: {
            args: Prisma.NewsFeedMetricStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NewsFeedMetricStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>
          }
          update: {
            args: Prisma.NewsFeedMetricStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>
          }
          deleteMany: {
            args: Prisma.NewsFeedMetricStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsFeedMetricStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewsFeedMetricStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedMetricStatePayload>
          }
          aggregate: {
            args: Prisma.NewsFeedMetricStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsFeedMetricState>
          }
          groupBy: {
            args: Prisma.NewsFeedMetricStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedMetricStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsFeedMetricStateCountArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedMetricStateCountAggregateOutputType> | number
          }
        }
      }
      NewsFeedSave: {
        payload: Prisma.$NewsFeedSavePayload<ExtArgs>
        fields: Prisma.NewsFeedSaveFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsFeedSaveFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsFeedSaveFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>
          }
          findFirst: {
            args: Prisma.NewsFeedSaveFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsFeedSaveFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>
          }
          findMany: {
            args: Prisma.NewsFeedSaveFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>[]
          }
          create: {
            args: Prisma.NewsFeedSaveCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>
          }
          createMany: {
            args: Prisma.NewsFeedSaveCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NewsFeedSaveDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>
          }
          update: {
            args: Prisma.NewsFeedSaveUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>
          }
          deleteMany: {
            args: Prisma.NewsFeedSaveDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsFeedSaveUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewsFeedSaveUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsFeedSavePayload>
          }
          aggregate: {
            args: Prisma.NewsFeedSaveAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsFeedSave>
          }
          groupBy: {
            args: Prisma.NewsFeedSaveGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedSaveGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsFeedSaveCountArgs<ExtArgs>
            result: $Utils.Optional<NewsFeedSaveCountAggregateOutputType> | number
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
    newsFeedItem?: NewsFeedItemOmit
    newsFeedLike?: NewsFeedLikeOmit
    newsFeedMetricState?: NewsFeedMetricStateOmit
    newsFeedSave?: NewsFeedSaveOmit
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
   * Count Type NewsFeedItemCountOutputType
   */

  export type NewsFeedItemCountOutputType = {
    likes: number
    saves: number
  }

  export type NewsFeedItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | NewsFeedItemCountOutputTypeCountLikesArgs
    saves?: boolean | NewsFeedItemCountOutputTypeCountSavesArgs
  }

  // Custom InputTypes
  /**
   * NewsFeedItemCountOutputType without action
   */
  export type NewsFeedItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItemCountOutputType
     */
    select?: NewsFeedItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewsFeedItemCountOutputType without action
   */
  export type NewsFeedItemCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsFeedLikeWhereInput
  }

  /**
   * NewsFeedItemCountOutputType without action
   */
  export type NewsFeedItemCountOutputTypeCountSavesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsFeedSaveWhereInput
  }


  /**
   * Models
   */

  /**
   * Model NewsFeedItem
   */

  export type AggregateNewsFeedItem = {
    _count: NewsFeedItemCountAggregateOutputType | null
    _avg: NewsFeedItemAvgAggregateOutputType | null
    _sum: NewsFeedItemSumAggregateOutputType | null
    _min: NewsFeedItemMinAggregateOutputType | null
    _max: NewsFeedItemMaxAggregateOutputType | null
  }

  export type NewsFeedItemAvgAggregateOutputType = {
    storeId: number | null
  }

  export type NewsFeedItemSumAggregateOutputType = {
    storeId: number | null
  }

  export type NewsFeedItemMinAggregateOutputType = {
    id: string | null
    type: $Enums.NewsFeedEventType | null
    title: string | null
    description: string | null
    storeId: number | null
    storeName: string | null
    createdAt: Date | null
  }

  export type NewsFeedItemMaxAggregateOutputType = {
    id: string | null
    type: $Enums.NewsFeedEventType | null
    title: string | null
    description: string | null
    storeId: number | null
    storeName: string | null
    createdAt: Date | null
  }

  export type NewsFeedItemCountAggregateOutputType = {
    id: number
    type: number
    title: number
    description: number
    storeId: number
    storeName: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type NewsFeedItemAvgAggregateInputType = {
    storeId?: true
  }

  export type NewsFeedItemSumAggregateInputType = {
    storeId?: true
  }

  export type NewsFeedItemMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    storeId?: true
    storeName?: true
    createdAt?: true
  }

  export type NewsFeedItemMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    storeId?: true
    storeName?: true
    createdAt?: true
  }

  export type NewsFeedItemCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    storeId?: true
    storeName?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type NewsFeedItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedItem to aggregate.
     */
    where?: NewsFeedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedItems to fetch.
     */
    orderBy?: NewsFeedItemOrderByWithRelationInput | NewsFeedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsFeedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsFeedItems
    **/
    _count?: true | NewsFeedItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsFeedItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsFeedItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsFeedItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsFeedItemMaxAggregateInputType
  }

  export type GetNewsFeedItemAggregateType<T extends NewsFeedItemAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsFeedItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsFeedItem[P]>
      : GetScalarType<T[P], AggregateNewsFeedItem[P]>
  }




  export type NewsFeedItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsFeedItemWhereInput
    orderBy?: NewsFeedItemOrderByWithAggregationInput | NewsFeedItemOrderByWithAggregationInput[]
    by: NewsFeedItemScalarFieldEnum[] | NewsFeedItemScalarFieldEnum
    having?: NewsFeedItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsFeedItemCountAggregateInputType | true
    _avg?: NewsFeedItemAvgAggregateInputType
    _sum?: NewsFeedItemSumAggregateInputType
    _min?: NewsFeedItemMinAggregateInputType
    _max?: NewsFeedItemMaxAggregateInputType
  }

  export type NewsFeedItemGroupByOutputType = {
    id: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId: number | null
    storeName: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: NewsFeedItemCountAggregateOutputType | null
    _avg: NewsFeedItemAvgAggregateOutputType | null
    _sum: NewsFeedItemSumAggregateOutputType | null
    _min: NewsFeedItemMinAggregateOutputType | null
    _max: NewsFeedItemMaxAggregateOutputType | null
  }

  type GetNewsFeedItemGroupByPayload<T extends NewsFeedItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsFeedItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsFeedItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsFeedItemGroupByOutputType[P]>
            : GetScalarType<T[P], NewsFeedItemGroupByOutputType[P]>
        }
      >
    >


  export type NewsFeedItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    storeId?: boolean
    storeName?: boolean
    metadata?: boolean
    createdAt?: boolean
    likes?: boolean | NewsFeedItem$likesArgs<ExtArgs>
    saves?: boolean | NewsFeedItem$savesArgs<ExtArgs>
    _count?: boolean | NewsFeedItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsFeedItem"]>



  export type NewsFeedItemSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    storeId?: boolean
    storeName?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type NewsFeedItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "title" | "description" | "storeId" | "storeName" | "metadata" | "createdAt", ExtArgs["result"]["newsFeedItem"]>
  export type NewsFeedItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | NewsFeedItem$likesArgs<ExtArgs>
    saves?: boolean | NewsFeedItem$savesArgs<ExtArgs>
    _count?: boolean | NewsFeedItemCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $NewsFeedItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsFeedItem"
    objects: {
      likes: Prisma.$NewsFeedLikePayload<ExtArgs>[]
      saves: Prisma.$NewsFeedSavePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.NewsFeedEventType
      title: string
      description: string
      storeId: number | null
      storeName: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["newsFeedItem"]>
    composites: {}
  }

  type NewsFeedItemGetPayload<S extends boolean | null | undefined | NewsFeedItemDefaultArgs> = $Result.GetResult<Prisma.$NewsFeedItemPayload, S>

  type NewsFeedItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsFeedItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsFeedItemCountAggregateInputType | true
    }

  export interface NewsFeedItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsFeedItem'], meta: { name: 'NewsFeedItem' } }
    /**
     * Find zero or one NewsFeedItem that matches the filter.
     * @param {NewsFeedItemFindUniqueArgs} args - Arguments to find a NewsFeedItem
     * @example
     * // Get one NewsFeedItem
     * const newsFeedItem = await prisma.newsFeedItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsFeedItemFindUniqueArgs>(args: SelectSubset<T, NewsFeedItemFindUniqueArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsFeedItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsFeedItemFindUniqueOrThrowArgs} args - Arguments to find a NewsFeedItem
     * @example
     * // Get one NewsFeedItem
     * const newsFeedItem = await prisma.newsFeedItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsFeedItemFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsFeedItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemFindFirstArgs} args - Arguments to find a NewsFeedItem
     * @example
     * // Get one NewsFeedItem
     * const newsFeedItem = await prisma.newsFeedItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsFeedItemFindFirstArgs>(args?: SelectSubset<T, NewsFeedItemFindFirstArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemFindFirstOrThrowArgs} args - Arguments to find a NewsFeedItem
     * @example
     * // Get one NewsFeedItem
     * const newsFeedItem = await prisma.newsFeedItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsFeedItemFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsFeedItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsFeedItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsFeedItems
     * const newsFeedItems = await prisma.newsFeedItem.findMany()
     * 
     * // Get first 10 NewsFeedItems
     * const newsFeedItems = await prisma.newsFeedItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsFeedItemWithIdOnly = await prisma.newsFeedItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsFeedItemFindManyArgs>(args?: SelectSubset<T, NewsFeedItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsFeedItem.
     * @param {NewsFeedItemCreateArgs} args - Arguments to create a NewsFeedItem.
     * @example
     * // Create one NewsFeedItem
     * const NewsFeedItem = await prisma.newsFeedItem.create({
     *   data: {
     *     // ... data to create a NewsFeedItem
     *   }
     * })
     * 
     */
    create<T extends NewsFeedItemCreateArgs>(args: SelectSubset<T, NewsFeedItemCreateArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsFeedItems.
     * @param {NewsFeedItemCreateManyArgs} args - Arguments to create many NewsFeedItems.
     * @example
     * // Create many NewsFeedItems
     * const newsFeedItem = await prisma.newsFeedItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsFeedItemCreateManyArgs>(args?: SelectSubset<T, NewsFeedItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a NewsFeedItem.
     * @param {NewsFeedItemDeleteArgs} args - Arguments to delete one NewsFeedItem.
     * @example
     * // Delete one NewsFeedItem
     * const NewsFeedItem = await prisma.newsFeedItem.delete({
     *   where: {
     *     // ... filter to delete one NewsFeedItem
     *   }
     * })
     * 
     */
    delete<T extends NewsFeedItemDeleteArgs>(args: SelectSubset<T, NewsFeedItemDeleteArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsFeedItem.
     * @param {NewsFeedItemUpdateArgs} args - Arguments to update one NewsFeedItem.
     * @example
     * // Update one NewsFeedItem
     * const newsFeedItem = await prisma.newsFeedItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsFeedItemUpdateArgs>(args: SelectSubset<T, NewsFeedItemUpdateArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsFeedItems.
     * @param {NewsFeedItemDeleteManyArgs} args - Arguments to filter NewsFeedItems to delete.
     * @example
     * // Delete a few NewsFeedItems
     * const { count } = await prisma.newsFeedItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsFeedItemDeleteManyArgs>(args?: SelectSubset<T, NewsFeedItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsFeedItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsFeedItems
     * const newsFeedItem = await prisma.newsFeedItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsFeedItemUpdateManyArgs>(args: SelectSubset<T, NewsFeedItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewsFeedItem.
     * @param {NewsFeedItemUpsertArgs} args - Arguments to update or create a NewsFeedItem.
     * @example
     * // Update or create a NewsFeedItem
     * const newsFeedItem = await prisma.newsFeedItem.upsert({
     *   create: {
     *     // ... data to create a NewsFeedItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsFeedItem we want to update
     *   }
     * })
     */
    upsert<T extends NewsFeedItemUpsertArgs>(args: SelectSubset<T, NewsFeedItemUpsertArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsFeedItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemCountArgs} args - Arguments to filter NewsFeedItems to count.
     * @example
     * // Count the number of NewsFeedItems
     * const count = await prisma.newsFeedItem.count({
     *   where: {
     *     // ... the filter for the NewsFeedItems we want to count
     *   }
     * })
    **/
    count<T extends NewsFeedItemCountArgs>(
      args?: Subset<T, NewsFeedItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsFeedItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsFeedItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NewsFeedItemAggregateArgs>(args: Subset<T, NewsFeedItemAggregateArgs>): Prisma.PrismaPromise<GetNewsFeedItemAggregateType<T>>

    /**
     * Group by NewsFeedItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedItemGroupByArgs} args - Group by arguments.
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
      T extends NewsFeedItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsFeedItemGroupByArgs['orderBy'] }
        : { orderBy?: NewsFeedItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NewsFeedItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsFeedItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsFeedItem model
   */
  readonly fields: NewsFeedItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsFeedItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsFeedItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    likes<T extends NewsFeedItem$likesArgs<ExtArgs> = {}>(args?: Subset<T, NewsFeedItem$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    saves<T extends NewsFeedItem$savesArgs<ExtArgs> = {}>(args?: Subset<T, NewsFeedItem$savesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the NewsFeedItem model
   */
  interface NewsFeedItemFieldRefs {
    readonly id: FieldRef<"NewsFeedItem", 'String'>
    readonly type: FieldRef<"NewsFeedItem", 'NewsFeedEventType'>
    readonly title: FieldRef<"NewsFeedItem", 'String'>
    readonly description: FieldRef<"NewsFeedItem", 'String'>
    readonly storeId: FieldRef<"NewsFeedItem", 'Int'>
    readonly storeName: FieldRef<"NewsFeedItem", 'String'>
    readonly metadata: FieldRef<"NewsFeedItem", 'Json'>
    readonly createdAt: FieldRef<"NewsFeedItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsFeedItem findUnique
   */
  export type NewsFeedItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedItem to fetch.
     */
    where: NewsFeedItemWhereUniqueInput
  }

  /**
   * NewsFeedItem findUniqueOrThrow
   */
  export type NewsFeedItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedItem to fetch.
     */
    where: NewsFeedItemWhereUniqueInput
  }

  /**
   * NewsFeedItem findFirst
   */
  export type NewsFeedItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedItem to fetch.
     */
    where?: NewsFeedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedItems to fetch.
     */
    orderBy?: NewsFeedItemOrderByWithRelationInput | NewsFeedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedItems.
     */
    cursor?: NewsFeedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedItems.
     */
    distinct?: NewsFeedItemScalarFieldEnum | NewsFeedItemScalarFieldEnum[]
  }

  /**
   * NewsFeedItem findFirstOrThrow
   */
  export type NewsFeedItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedItem to fetch.
     */
    where?: NewsFeedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedItems to fetch.
     */
    orderBy?: NewsFeedItemOrderByWithRelationInput | NewsFeedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedItems.
     */
    cursor?: NewsFeedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedItems.
     */
    distinct?: NewsFeedItemScalarFieldEnum | NewsFeedItemScalarFieldEnum[]
  }

  /**
   * NewsFeedItem findMany
   */
  export type NewsFeedItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedItems to fetch.
     */
    where?: NewsFeedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedItems to fetch.
     */
    orderBy?: NewsFeedItemOrderByWithRelationInput | NewsFeedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsFeedItems.
     */
    cursor?: NewsFeedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedItems.
     */
    skip?: number
    distinct?: NewsFeedItemScalarFieldEnum | NewsFeedItemScalarFieldEnum[]
  }

  /**
   * NewsFeedItem create
   */
  export type NewsFeedItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsFeedItem.
     */
    data: XOR<NewsFeedItemCreateInput, NewsFeedItemUncheckedCreateInput>
  }

  /**
   * NewsFeedItem createMany
   */
  export type NewsFeedItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsFeedItems.
     */
    data: NewsFeedItemCreateManyInput | NewsFeedItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsFeedItem update
   */
  export type NewsFeedItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsFeedItem.
     */
    data: XOR<NewsFeedItemUpdateInput, NewsFeedItemUncheckedUpdateInput>
    /**
     * Choose, which NewsFeedItem to update.
     */
    where: NewsFeedItemWhereUniqueInput
  }

  /**
   * NewsFeedItem updateMany
   */
  export type NewsFeedItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsFeedItems.
     */
    data: XOR<NewsFeedItemUpdateManyMutationInput, NewsFeedItemUncheckedUpdateManyInput>
    /**
     * Filter which NewsFeedItems to update
     */
    where?: NewsFeedItemWhereInput
    /**
     * Limit how many NewsFeedItems to update.
     */
    limit?: number
  }

  /**
   * NewsFeedItem upsert
   */
  export type NewsFeedItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsFeedItem to update in case it exists.
     */
    where: NewsFeedItemWhereUniqueInput
    /**
     * In case the NewsFeedItem found by the `where` argument doesn't exist, create a new NewsFeedItem with this data.
     */
    create: XOR<NewsFeedItemCreateInput, NewsFeedItemUncheckedCreateInput>
    /**
     * In case the NewsFeedItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsFeedItemUpdateInput, NewsFeedItemUncheckedUpdateInput>
  }

  /**
   * NewsFeedItem delete
   */
  export type NewsFeedItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
    /**
     * Filter which NewsFeedItem to delete.
     */
    where: NewsFeedItemWhereUniqueInput
  }

  /**
   * NewsFeedItem deleteMany
   */
  export type NewsFeedItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedItems to delete
     */
    where?: NewsFeedItemWhereInput
    /**
     * Limit how many NewsFeedItems to delete.
     */
    limit?: number
  }

  /**
   * NewsFeedItem.likes
   */
  export type NewsFeedItem$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    where?: NewsFeedLikeWhereInput
    orderBy?: NewsFeedLikeOrderByWithRelationInput | NewsFeedLikeOrderByWithRelationInput[]
    cursor?: NewsFeedLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsFeedLikeScalarFieldEnum | NewsFeedLikeScalarFieldEnum[]
  }

  /**
   * NewsFeedItem.saves
   */
  export type NewsFeedItem$savesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    where?: NewsFeedSaveWhereInput
    orderBy?: NewsFeedSaveOrderByWithRelationInput | NewsFeedSaveOrderByWithRelationInput[]
    cursor?: NewsFeedSaveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsFeedSaveScalarFieldEnum | NewsFeedSaveScalarFieldEnum[]
  }

  /**
   * NewsFeedItem without action
   */
  export type NewsFeedItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedItem
     */
    select?: NewsFeedItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedItem
     */
    omit?: NewsFeedItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedItemInclude<ExtArgs> | null
  }


  /**
   * Model NewsFeedLike
   */

  export type AggregateNewsFeedLike = {
    _count: NewsFeedLikeCountAggregateOutputType | null
    _min: NewsFeedLikeMinAggregateOutputType | null
    _max: NewsFeedLikeMaxAggregateOutputType | null
  }

  export type NewsFeedLikeMinAggregateOutputType = {
    id: string | null
    newsFeedItemId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type NewsFeedLikeMaxAggregateOutputType = {
    id: string | null
    newsFeedItemId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type NewsFeedLikeCountAggregateOutputType = {
    id: number
    newsFeedItemId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type NewsFeedLikeMinAggregateInputType = {
    id?: true
    newsFeedItemId?: true
    userId?: true
    createdAt?: true
  }

  export type NewsFeedLikeMaxAggregateInputType = {
    id?: true
    newsFeedItemId?: true
    userId?: true
    createdAt?: true
  }

  export type NewsFeedLikeCountAggregateInputType = {
    id?: true
    newsFeedItemId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type NewsFeedLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedLike to aggregate.
     */
    where?: NewsFeedLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedLikes to fetch.
     */
    orderBy?: NewsFeedLikeOrderByWithRelationInput | NewsFeedLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsFeedLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsFeedLikes
    **/
    _count?: true | NewsFeedLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsFeedLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsFeedLikeMaxAggregateInputType
  }

  export type GetNewsFeedLikeAggregateType<T extends NewsFeedLikeAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsFeedLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsFeedLike[P]>
      : GetScalarType<T[P], AggregateNewsFeedLike[P]>
  }




  export type NewsFeedLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsFeedLikeWhereInput
    orderBy?: NewsFeedLikeOrderByWithAggregationInput | NewsFeedLikeOrderByWithAggregationInput[]
    by: NewsFeedLikeScalarFieldEnum[] | NewsFeedLikeScalarFieldEnum
    having?: NewsFeedLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsFeedLikeCountAggregateInputType | true
    _min?: NewsFeedLikeMinAggregateInputType
    _max?: NewsFeedLikeMaxAggregateInputType
  }

  export type NewsFeedLikeGroupByOutputType = {
    id: string
    newsFeedItemId: string
    userId: string
    createdAt: Date
    _count: NewsFeedLikeCountAggregateOutputType | null
    _min: NewsFeedLikeMinAggregateOutputType | null
    _max: NewsFeedLikeMaxAggregateOutputType | null
  }

  type GetNewsFeedLikeGroupByPayload<T extends NewsFeedLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsFeedLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsFeedLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsFeedLikeGroupByOutputType[P]>
            : GetScalarType<T[P], NewsFeedLikeGroupByOutputType[P]>
        }
      >
    >


  export type NewsFeedLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    newsFeedItemId?: boolean
    userId?: boolean
    createdAt?: boolean
    newsFeedItem?: boolean | NewsFeedItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsFeedLike"]>



  export type NewsFeedLikeSelectScalar = {
    id?: boolean
    newsFeedItemId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type NewsFeedLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "newsFeedItemId" | "userId" | "createdAt", ExtArgs["result"]["newsFeedLike"]>
  export type NewsFeedLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsFeedItem?: boolean | NewsFeedItemDefaultArgs<ExtArgs>
  }

  export type $NewsFeedLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsFeedLike"
    objects: {
      newsFeedItem: Prisma.$NewsFeedItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      newsFeedItemId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["newsFeedLike"]>
    composites: {}
  }

  type NewsFeedLikeGetPayload<S extends boolean | null | undefined | NewsFeedLikeDefaultArgs> = $Result.GetResult<Prisma.$NewsFeedLikePayload, S>

  type NewsFeedLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsFeedLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsFeedLikeCountAggregateInputType | true
    }

  export interface NewsFeedLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsFeedLike'], meta: { name: 'NewsFeedLike' } }
    /**
     * Find zero or one NewsFeedLike that matches the filter.
     * @param {NewsFeedLikeFindUniqueArgs} args - Arguments to find a NewsFeedLike
     * @example
     * // Get one NewsFeedLike
     * const newsFeedLike = await prisma.newsFeedLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsFeedLikeFindUniqueArgs>(args: SelectSubset<T, NewsFeedLikeFindUniqueArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsFeedLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsFeedLikeFindUniqueOrThrowArgs} args - Arguments to find a NewsFeedLike
     * @example
     * // Get one NewsFeedLike
     * const newsFeedLike = await prisma.newsFeedLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsFeedLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsFeedLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeFindFirstArgs} args - Arguments to find a NewsFeedLike
     * @example
     * // Get one NewsFeedLike
     * const newsFeedLike = await prisma.newsFeedLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsFeedLikeFindFirstArgs>(args?: SelectSubset<T, NewsFeedLikeFindFirstArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeFindFirstOrThrowArgs} args - Arguments to find a NewsFeedLike
     * @example
     * // Get one NewsFeedLike
     * const newsFeedLike = await prisma.newsFeedLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsFeedLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsFeedLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsFeedLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsFeedLikes
     * const newsFeedLikes = await prisma.newsFeedLike.findMany()
     * 
     * // Get first 10 NewsFeedLikes
     * const newsFeedLikes = await prisma.newsFeedLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsFeedLikeWithIdOnly = await prisma.newsFeedLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsFeedLikeFindManyArgs>(args?: SelectSubset<T, NewsFeedLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsFeedLike.
     * @param {NewsFeedLikeCreateArgs} args - Arguments to create a NewsFeedLike.
     * @example
     * // Create one NewsFeedLike
     * const NewsFeedLike = await prisma.newsFeedLike.create({
     *   data: {
     *     // ... data to create a NewsFeedLike
     *   }
     * })
     * 
     */
    create<T extends NewsFeedLikeCreateArgs>(args: SelectSubset<T, NewsFeedLikeCreateArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsFeedLikes.
     * @param {NewsFeedLikeCreateManyArgs} args - Arguments to create many NewsFeedLikes.
     * @example
     * // Create many NewsFeedLikes
     * const newsFeedLike = await prisma.newsFeedLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsFeedLikeCreateManyArgs>(args?: SelectSubset<T, NewsFeedLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a NewsFeedLike.
     * @param {NewsFeedLikeDeleteArgs} args - Arguments to delete one NewsFeedLike.
     * @example
     * // Delete one NewsFeedLike
     * const NewsFeedLike = await prisma.newsFeedLike.delete({
     *   where: {
     *     // ... filter to delete one NewsFeedLike
     *   }
     * })
     * 
     */
    delete<T extends NewsFeedLikeDeleteArgs>(args: SelectSubset<T, NewsFeedLikeDeleteArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsFeedLike.
     * @param {NewsFeedLikeUpdateArgs} args - Arguments to update one NewsFeedLike.
     * @example
     * // Update one NewsFeedLike
     * const newsFeedLike = await prisma.newsFeedLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsFeedLikeUpdateArgs>(args: SelectSubset<T, NewsFeedLikeUpdateArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsFeedLikes.
     * @param {NewsFeedLikeDeleteManyArgs} args - Arguments to filter NewsFeedLikes to delete.
     * @example
     * // Delete a few NewsFeedLikes
     * const { count } = await prisma.newsFeedLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsFeedLikeDeleteManyArgs>(args?: SelectSubset<T, NewsFeedLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsFeedLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsFeedLikes
     * const newsFeedLike = await prisma.newsFeedLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsFeedLikeUpdateManyArgs>(args: SelectSubset<T, NewsFeedLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewsFeedLike.
     * @param {NewsFeedLikeUpsertArgs} args - Arguments to update or create a NewsFeedLike.
     * @example
     * // Update or create a NewsFeedLike
     * const newsFeedLike = await prisma.newsFeedLike.upsert({
     *   create: {
     *     // ... data to create a NewsFeedLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsFeedLike we want to update
     *   }
     * })
     */
    upsert<T extends NewsFeedLikeUpsertArgs>(args: SelectSubset<T, NewsFeedLikeUpsertArgs<ExtArgs>>): Prisma__NewsFeedLikeClient<$Result.GetResult<Prisma.$NewsFeedLikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsFeedLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeCountArgs} args - Arguments to filter NewsFeedLikes to count.
     * @example
     * // Count the number of NewsFeedLikes
     * const count = await prisma.newsFeedLike.count({
     *   where: {
     *     // ... the filter for the NewsFeedLikes we want to count
     *   }
     * })
    **/
    count<T extends NewsFeedLikeCountArgs>(
      args?: Subset<T, NewsFeedLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsFeedLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsFeedLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NewsFeedLikeAggregateArgs>(args: Subset<T, NewsFeedLikeAggregateArgs>): Prisma.PrismaPromise<GetNewsFeedLikeAggregateType<T>>

    /**
     * Group by NewsFeedLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedLikeGroupByArgs} args - Group by arguments.
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
      T extends NewsFeedLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsFeedLikeGroupByArgs['orderBy'] }
        : { orderBy?: NewsFeedLikeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NewsFeedLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsFeedLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsFeedLike model
   */
  readonly fields: NewsFeedLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsFeedLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsFeedLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    newsFeedItem<T extends NewsFeedItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NewsFeedItemDefaultArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the NewsFeedLike model
   */
  interface NewsFeedLikeFieldRefs {
    readonly id: FieldRef<"NewsFeedLike", 'String'>
    readonly newsFeedItemId: FieldRef<"NewsFeedLike", 'String'>
    readonly userId: FieldRef<"NewsFeedLike", 'String'>
    readonly createdAt: FieldRef<"NewsFeedLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsFeedLike findUnique
   */
  export type NewsFeedLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedLike to fetch.
     */
    where: NewsFeedLikeWhereUniqueInput
  }

  /**
   * NewsFeedLike findUniqueOrThrow
   */
  export type NewsFeedLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedLike to fetch.
     */
    where: NewsFeedLikeWhereUniqueInput
  }

  /**
   * NewsFeedLike findFirst
   */
  export type NewsFeedLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedLike to fetch.
     */
    where?: NewsFeedLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedLikes to fetch.
     */
    orderBy?: NewsFeedLikeOrderByWithRelationInput | NewsFeedLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedLikes.
     */
    cursor?: NewsFeedLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedLikes.
     */
    distinct?: NewsFeedLikeScalarFieldEnum | NewsFeedLikeScalarFieldEnum[]
  }

  /**
   * NewsFeedLike findFirstOrThrow
   */
  export type NewsFeedLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedLike to fetch.
     */
    where?: NewsFeedLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedLikes to fetch.
     */
    orderBy?: NewsFeedLikeOrderByWithRelationInput | NewsFeedLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedLikes.
     */
    cursor?: NewsFeedLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedLikes.
     */
    distinct?: NewsFeedLikeScalarFieldEnum | NewsFeedLikeScalarFieldEnum[]
  }

  /**
   * NewsFeedLike findMany
   */
  export type NewsFeedLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedLikes to fetch.
     */
    where?: NewsFeedLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedLikes to fetch.
     */
    orderBy?: NewsFeedLikeOrderByWithRelationInput | NewsFeedLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsFeedLikes.
     */
    cursor?: NewsFeedLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedLikes.
     */
    skip?: number
    distinct?: NewsFeedLikeScalarFieldEnum | NewsFeedLikeScalarFieldEnum[]
  }

  /**
   * NewsFeedLike create
   */
  export type NewsFeedLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsFeedLike.
     */
    data: XOR<NewsFeedLikeCreateInput, NewsFeedLikeUncheckedCreateInput>
  }

  /**
   * NewsFeedLike createMany
   */
  export type NewsFeedLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsFeedLikes.
     */
    data: NewsFeedLikeCreateManyInput | NewsFeedLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsFeedLike update
   */
  export type NewsFeedLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsFeedLike.
     */
    data: XOR<NewsFeedLikeUpdateInput, NewsFeedLikeUncheckedUpdateInput>
    /**
     * Choose, which NewsFeedLike to update.
     */
    where: NewsFeedLikeWhereUniqueInput
  }

  /**
   * NewsFeedLike updateMany
   */
  export type NewsFeedLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsFeedLikes.
     */
    data: XOR<NewsFeedLikeUpdateManyMutationInput, NewsFeedLikeUncheckedUpdateManyInput>
    /**
     * Filter which NewsFeedLikes to update
     */
    where?: NewsFeedLikeWhereInput
    /**
     * Limit how many NewsFeedLikes to update.
     */
    limit?: number
  }

  /**
   * NewsFeedLike upsert
   */
  export type NewsFeedLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsFeedLike to update in case it exists.
     */
    where: NewsFeedLikeWhereUniqueInput
    /**
     * In case the NewsFeedLike found by the `where` argument doesn't exist, create a new NewsFeedLike with this data.
     */
    create: XOR<NewsFeedLikeCreateInput, NewsFeedLikeUncheckedCreateInput>
    /**
     * In case the NewsFeedLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsFeedLikeUpdateInput, NewsFeedLikeUncheckedUpdateInput>
  }

  /**
   * NewsFeedLike delete
   */
  export type NewsFeedLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
    /**
     * Filter which NewsFeedLike to delete.
     */
    where: NewsFeedLikeWhereUniqueInput
  }

  /**
   * NewsFeedLike deleteMany
   */
  export type NewsFeedLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedLikes to delete
     */
    where?: NewsFeedLikeWhereInput
    /**
     * Limit how many NewsFeedLikes to delete.
     */
    limit?: number
  }

  /**
   * NewsFeedLike without action
   */
  export type NewsFeedLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedLike
     */
    select?: NewsFeedLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedLike
     */
    omit?: NewsFeedLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedLikeInclude<ExtArgs> | null
  }


  /**
   * Model NewsFeedMetricState
   */

  export type AggregateNewsFeedMetricState = {
    _count: NewsFeedMetricStateCountAggregateOutputType | null
    _avg: NewsFeedMetricStateAvgAggregateOutputType | null
    _sum: NewsFeedMetricStateSumAggregateOutputType | null
    _min: NewsFeedMetricStateMinAggregateOutputType | null
    _max: NewsFeedMetricStateMaxAggregateOutputType | null
  }

  export type NewsFeedMetricStateAvgAggregateOutputType = {
    storeId: number | null
  }

  export type NewsFeedMetricStateSumAggregateOutputType = {
    storeId: number | null
  }

  export type NewsFeedMetricStateMinAggregateOutputType = {
    metric: $Enums.NewsFeedMetric | null
    storeId: number | null
    updatedAt: Date | null
  }

  export type NewsFeedMetricStateMaxAggregateOutputType = {
    metric: $Enums.NewsFeedMetric | null
    storeId: number | null
    updatedAt: Date | null
  }

  export type NewsFeedMetricStateCountAggregateOutputType = {
    metric: number
    storeId: number
    updatedAt: number
    _all: number
  }


  export type NewsFeedMetricStateAvgAggregateInputType = {
    storeId?: true
  }

  export type NewsFeedMetricStateSumAggregateInputType = {
    storeId?: true
  }

  export type NewsFeedMetricStateMinAggregateInputType = {
    metric?: true
    storeId?: true
    updatedAt?: true
  }

  export type NewsFeedMetricStateMaxAggregateInputType = {
    metric?: true
    storeId?: true
    updatedAt?: true
  }

  export type NewsFeedMetricStateCountAggregateInputType = {
    metric?: true
    storeId?: true
    updatedAt?: true
    _all?: true
  }

  export type NewsFeedMetricStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedMetricState to aggregate.
     */
    where?: NewsFeedMetricStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedMetricStates to fetch.
     */
    orderBy?: NewsFeedMetricStateOrderByWithRelationInput | NewsFeedMetricStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsFeedMetricStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedMetricStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedMetricStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsFeedMetricStates
    **/
    _count?: true | NewsFeedMetricStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsFeedMetricStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsFeedMetricStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsFeedMetricStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsFeedMetricStateMaxAggregateInputType
  }

  export type GetNewsFeedMetricStateAggregateType<T extends NewsFeedMetricStateAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsFeedMetricState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsFeedMetricState[P]>
      : GetScalarType<T[P], AggregateNewsFeedMetricState[P]>
  }




  export type NewsFeedMetricStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsFeedMetricStateWhereInput
    orderBy?: NewsFeedMetricStateOrderByWithAggregationInput | NewsFeedMetricStateOrderByWithAggregationInput[]
    by: NewsFeedMetricStateScalarFieldEnum[] | NewsFeedMetricStateScalarFieldEnum
    having?: NewsFeedMetricStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsFeedMetricStateCountAggregateInputType | true
    _avg?: NewsFeedMetricStateAvgAggregateInputType
    _sum?: NewsFeedMetricStateSumAggregateInputType
    _min?: NewsFeedMetricStateMinAggregateInputType
    _max?: NewsFeedMetricStateMaxAggregateInputType
  }

  export type NewsFeedMetricStateGroupByOutputType = {
    metric: $Enums.NewsFeedMetric
    storeId: number | null
    updatedAt: Date
    _count: NewsFeedMetricStateCountAggregateOutputType | null
    _avg: NewsFeedMetricStateAvgAggregateOutputType | null
    _sum: NewsFeedMetricStateSumAggregateOutputType | null
    _min: NewsFeedMetricStateMinAggregateOutputType | null
    _max: NewsFeedMetricStateMaxAggregateOutputType | null
  }

  type GetNewsFeedMetricStateGroupByPayload<T extends NewsFeedMetricStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsFeedMetricStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsFeedMetricStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsFeedMetricStateGroupByOutputType[P]>
            : GetScalarType<T[P], NewsFeedMetricStateGroupByOutputType[P]>
        }
      >
    >


  export type NewsFeedMetricStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    metric?: boolean
    storeId?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["newsFeedMetricState"]>



  export type NewsFeedMetricStateSelectScalar = {
    metric?: boolean
    storeId?: boolean
    updatedAt?: boolean
  }

  export type NewsFeedMetricStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"metric" | "storeId" | "updatedAt", ExtArgs["result"]["newsFeedMetricState"]>

  export type $NewsFeedMetricStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsFeedMetricState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      metric: $Enums.NewsFeedMetric
      storeId: number | null
      updatedAt: Date
    }, ExtArgs["result"]["newsFeedMetricState"]>
    composites: {}
  }

  type NewsFeedMetricStateGetPayload<S extends boolean | null | undefined | NewsFeedMetricStateDefaultArgs> = $Result.GetResult<Prisma.$NewsFeedMetricStatePayload, S>

  type NewsFeedMetricStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsFeedMetricStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsFeedMetricStateCountAggregateInputType | true
    }

  export interface NewsFeedMetricStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsFeedMetricState'], meta: { name: 'NewsFeedMetricState' } }
    /**
     * Find zero or one NewsFeedMetricState that matches the filter.
     * @param {NewsFeedMetricStateFindUniqueArgs} args - Arguments to find a NewsFeedMetricState
     * @example
     * // Get one NewsFeedMetricState
     * const newsFeedMetricState = await prisma.newsFeedMetricState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsFeedMetricStateFindUniqueArgs>(args: SelectSubset<T, NewsFeedMetricStateFindUniqueArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsFeedMetricState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsFeedMetricStateFindUniqueOrThrowArgs} args - Arguments to find a NewsFeedMetricState
     * @example
     * // Get one NewsFeedMetricState
     * const newsFeedMetricState = await prisma.newsFeedMetricState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsFeedMetricStateFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsFeedMetricStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedMetricState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateFindFirstArgs} args - Arguments to find a NewsFeedMetricState
     * @example
     * // Get one NewsFeedMetricState
     * const newsFeedMetricState = await prisma.newsFeedMetricState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsFeedMetricStateFindFirstArgs>(args?: SelectSubset<T, NewsFeedMetricStateFindFirstArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedMetricState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateFindFirstOrThrowArgs} args - Arguments to find a NewsFeedMetricState
     * @example
     * // Get one NewsFeedMetricState
     * const newsFeedMetricState = await prisma.newsFeedMetricState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsFeedMetricStateFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsFeedMetricStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsFeedMetricStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsFeedMetricStates
     * const newsFeedMetricStates = await prisma.newsFeedMetricState.findMany()
     * 
     * // Get first 10 NewsFeedMetricStates
     * const newsFeedMetricStates = await prisma.newsFeedMetricState.findMany({ take: 10 })
     * 
     * // Only select the `storeId`
     * const newsFeedMetricStateWithStoreIdOnly = await prisma.newsFeedMetricState.findMany({ select: { storeId: true } })
     * 
     */
    findMany<T extends NewsFeedMetricStateFindManyArgs>(args?: SelectSubset<T, NewsFeedMetricStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsFeedMetricState.
     * @param {NewsFeedMetricStateCreateArgs} args - Arguments to create a NewsFeedMetricState.
     * @example
     * // Create one NewsFeedMetricState
     * const NewsFeedMetricState = await prisma.newsFeedMetricState.create({
     *   data: {
     *     // ... data to create a NewsFeedMetricState
     *   }
     * })
     * 
     */
    create<T extends NewsFeedMetricStateCreateArgs>(args: SelectSubset<T, NewsFeedMetricStateCreateArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsFeedMetricStates.
     * @param {NewsFeedMetricStateCreateManyArgs} args - Arguments to create many NewsFeedMetricStates.
     * @example
     * // Create many NewsFeedMetricStates
     * const newsFeedMetricState = await prisma.newsFeedMetricState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsFeedMetricStateCreateManyArgs>(args?: SelectSubset<T, NewsFeedMetricStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a NewsFeedMetricState.
     * @param {NewsFeedMetricStateDeleteArgs} args - Arguments to delete one NewsFeedMetricState.
     * @example
     * // Delete one NewsFeedMetricState
     * const NewsFeedMetricState = await prisma.newsFeedMetricState.delete({
     *   where: {
     *     // ... filter to delete one NewsFeedMetricState
     *   }
     * })
     * 
     */
    delete<T extends NewsFeedMetricStateDeleteArgs>(args: SelectSubset<T, NewsFeedMetricStateDeleteArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsFeedMetricState.
     * @param {NewsFeedMetricStateUpdateArgs} args - Arguments to update one NewsFeedMetricState.
     * @example
     * // Update one NewsFeedMetricState
     * const newsFeedMetricState = await prisma.newsFeedMetricState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsFeedMetricStateUpdateArgs>(args: SelectSubset<T, NewsFeedMetricStateUpdateArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsFeedMetricStates.
     * @param {NewsFeedMetricStateDeleteManyArgs} args - Arguments to filter NewsFeedMetricStates to delete.
     * @example
     * // Delete a few NewsFeedMetricStates
     * const { count } = await prisma.newsFeedMetricState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsFeedMetricStateDeleteManyArgs>(args?: SelectSubset<T, NewsFeedMetricStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsFeedMetricStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsFeedMetricStates
     * const newsFeedMetricState = await prisma.newsFeedMetricState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsFeedMetricStateUpdateManyArgs>(args: SelectSubset<T, NewsFeedMetricStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewsFeedMetricState.
     * @param {NewsFeedMetricStateUpsertArgs} args - Arguments to update or create a NewsFeedMetricState.
     * @example
     * // Update or create a NewsFeedMetricState
     * const newsFeedMetricState = await prisma.newsFeedMetricState.upsert({
     *   create: {
     *     // ... data to create a NewsFeedMetricState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsFeedMetricState we want to update
     *   }
     * })
     */
    upsert<T extends NewsFeedMetricStateUpsertArgs>(args: SelectSubset<T, NewsFeedMetricStateUpsertArgs<ExtArgs>>): Prisma__NewsFeedMetricStateClient<$Result.GetResult<Prisma.$NewsFeedMetricStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsFeedMetricStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateCountArgs} args - Arguments to filter NewsFeedMetricStates to count.
     * @example
     * // Count the number of NewsFeedMetricStates
     * const count = await prisma.newsFeedMetricState.count({
     *   where: {
     *     // ... the filter for the NewsFeedMetricStates we want to count
     *   }
     * })
    **/
    count<T extends NewsFeedMetricStateCountArgs>(
      args?: Subset<T, NewsFeedMetricStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsFeedMetricStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsFeedMetricState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NewsFeedMetricStateAggregateArgs>(args: Subset<T, NewsFeedMetricStateAggregateArgs>): Prisma.PrismaPromise<GetNewsFeedMetricStateAggregateType<T>>

    /**
     * Group by NewsFeedMetricState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedMetricStateGroupByArgs} args - Group by arguments.
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
      T extends NewsFeedMetricStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsFeedMetricStateGroupByArgs['orderBy'] }
        : { orderBy?: NewsFeedMetricStateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NewsFeedMetricStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsFeedMetricStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsFeedMetricState model
   */
  readonly fields: NewsFeedMetricStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsFeedMetricState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsFeedMetricStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the NewsFeedMetricState model
   */
  interface NewsFeedMetricStateFieldRefs {
    readonly metric: FieldRef<"NewsFeedMetricState", 'NewsFeedMetric'>
    readonly storeId: FieldRef<"NewsFeedMetricState", 'Int'>
    readonly updatedAt: FieldRef<"NewsFeedMetricState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsFeedMetricState findUnique
   */
  export type NewsFeedMetricStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * Filter, which NewsFeedMetricState to fetch.
     */
    where: NewsFeedMetricStateWhereUniqueInput
  }

  /**
   * NewsFeedMetricState findUniqueOrThrow
   */
  export type NewsFeedMetricStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * Filter, which NewsFeedMetricState to fetch.
     */
    where: NewsFeedMetricStateWhereUniqueInput
  }

  /**
   * NewsFeedMetricState findFirst
   */
  export type NewsFeedMetricStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * Filter, which NewsFeedMetricState to fetch.
     */
    where?: NewsFeedMetricStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedMetricStates to fetch.
     */
    orderBy?: NewsFeedMetricStateOrderByWithRelationInput | NewsFeedMetricStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedMetricStates.
     */
    cursor?: NewsFeedMetricStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedMetricStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedMetricStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedMetricStates.
     */
    distinct?: NewsFeedMetricStateScalarFieldEnum | NewsFeedMetricStateScalarFieldEnum[]
  }

  /**
   * NewsFeedMetricState findFirstOrThrow
   */
  export type NewsFeedMetricStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * Filter, which NewsFeedMetricState to fetch.
     */
    where?: NewsFeedMetricStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedMetricStates to fetch.
     */
    orderBy?: NewsFeedMetricStateOrderByWithRelationInput | NewsFeedMetricStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedMetricStates.
     */
    cursor?: NewsFeedMetricStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedMetricStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedMetricStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedMetricStates.
     */
    distinct?: NewsFeedMetricStateScalarFieldEnum | NewsFeedMetricStateScalarFieldEnum[]
  }

  /**
   * NewsFeedMetricState findMany
   */
  export type NewsFeedMetricStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * Filter, which NewsFeedMetricStates to fetch.
     */
    where?: NewsFeedMetricStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedMetricStates to fetch.
     */
    orderBy?: NewsFeedMetricStateOrderByWithRelationInput | NewsFeedMetricStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsFeedMetricStates.
     */
    cursor?: NewsFeedMetricStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedMetricStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedMetricStates.
     */
    skip?: number
    distinct?: NewsFeedMetricStateScalarFieldEnum | NewsFeedMetricStateScalarFieldEnum[]
  }

  /**
   * NewsFeedMetricState create
   */
  export type NewsFeedMetricStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * The data needed to create a NewsFeedMetricState.
     */
    data: XOR<NewsFeedMetricStateCreateInput, NewsFeedMetricStateUncheckedCreateInput>
  }

  /**
   * NewsFeedMetricState createMany
   */
  export type NewsFeedMetricStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsFeedMetricStates.
     */
    data: NewsFeedMetricStateCreateManyInput | NewsFeedMetricStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsFeedMetricState update
   */
  export type NewsFeedMetricStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * The data needed to update a NewsFeedMetricState.
     */
    data: XOR<NewsFeedMetricStateUpdateInput, NewsFeedMetricStateUncheckedUpdateInput>
    /**
     * Choose, which NewsFeedMetricState to update.
     */
    where: NewsFeedMetricStateWhereUniqueInput
  }

  /**
   * NewsFeedMetricState updateMany
   */
  export type NewsFeedMetricStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsFeedMetricStates.
     */
    data: XOR<NewsFeedMetricStateUpdateManyMutationInput, NewsFeedMetricStateUncheckedUpdateManyInput>
    /**
     * Filter which NewsFeedMetricStates to update
     */
    where?: NewsFeedMetricStateWhereInput
    /**
     * Limit how many NewsFeedMetricStates to update.
     */
    limit?: number
  }

  /**
   * NewsFeedMetricState upsert
   */
  export type NewsFeedMetricStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * The filter to search for the NewsFeedMetricState to update in case it exists.
     */
    where: NewsFeedMetricStateWhereUniqueInput
    /**
     * In case the NewsFeedMetricState found by the `where` argument doesn't exist, create a new NewsFeedMetricState with this data.
     */
    create: XOR<NewsFeedMetricStateCreateInput, NewsFeedMetricStateUncheckedCreateInput>
    /**
     * In case the NewsFeedMetricState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsFeedMetricStateUpdateInput, NewsFeedMetricStateUncheckedUpdateInput>
  }

  /**
   * NewsFeedMetricState delete
   */
  export type NewsFeedMetricStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
    /**
     * Filter which NewsFeedMetricState to delete.
     */
    where: NewsFeedMetricStateWhereUniqueInput
  }

  /**
   * NewsFeedMetricState deleteMany
   */
  export type NewsFeedMetricStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedMetricStates to delete
     */
    where?: NewsFeedMetricStateWhereInput
    /**
     * Limit how many NewsFeedMetricStates to delete.
     */
    limit?: number
  }

  /**
   * NewsFeedMetricState without action
   */
  export type NewsFeedMetricStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedMetricState
     */
    select?: NewsFeedMetricStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedMetricState
     */
    omit?: NewsFeedMetricStateOmit<ExtArgs> | null
  }


  /**
   * Model NewsFeedSave
   */

  export type AggregateNewsFeedSave = {
    _count: NewsFeedSaveCountAggregateOutputType | null
    _min: NewsFeedSaveMinAggregateOutputType | null
    _max: NewsFeedSaveMaxAggregateOutputType | null
  }

  export type NewsFeedSaveMinAggregateOutputType = {
    id: string | null
    newsFeedItemId: string | null
    userId: string | null
    savedAt: Date | null
    expiresAt: Date | null
  }

  export type NewsFeedSaveMaxAggregateOutputType = {
    id: string | null
    newsFeedItemId: string | null
    userId: string | null
    savedAt: Date | null
    expiresAt: Date | null
  }

  export type NewsFeedSaveCountAggregateOutputType = {
    id: number
    newsFeedItemId: number
    userId: number
    savedAt: number
    expiresAt: number
    _all: number
  }


  export type NewsFeedSaveMinAggregateInputType = {
    id?: true
    newsFeedItemId?: true
    userId?: true
    savedAt?: true
    expiresAt?: true
  }

  export type NewsFeedSaveMaxAggregateInputType = {
    id?: true
    newsFeedItemId?: true
    userId?: true
    savedAt?: true
    expiresAt?: true
  }

  export type NewsFeedSaveCountAggregateInputType = {
    id?: true
    newsFeedItemId?: true
    userId?: true
    savedAt?: true
    expiresAt?: true
    _all?: true
  }

  export type NewsFeedSaveAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedSave to aggregate.
     */
    where?: NewsFeedSaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedSaves to fetch.
     */
    orderBy?: NewsFeedSaveOrderByWithRelationInput | NewsFeedSaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsFeedSaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedSaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedSaves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsFeedSaves
    **/
    _count?: true | NewsFeedSaveCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsFeedSaveMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsFeedSaveMaxAggregateInputType
  }

  export type GetNewsFeedSaveAggregateType<T extends NewsFeedSaveAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsFeedSave]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsFeedSave[P]>
      : GetScalarType<T[P], AggregateNewsFeedSave[P]>
  }




  export type NewsFeedSaveGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsFeedSaveWhereInput
    orderBy?: NewsFeedSaveOrderByWithAggregationInput | NewsFeedSaveOrderByWithAggregationInput[]
    by: NewsFeedSaveScalarFieldEnum[] | NewsFeedSaveScalarFieldEnum
    having?: NewsFeedSaveScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsFeedSaveCountAggregateInputType | true
    _min?: NewsFeedSaveMinAggregateInputType
    _max?: NewsFeedSaveMaxAggregateInputType
  }

  export type NewsFeedSaveGroupByOutputType = {
    id: string
    newsFeedItemId: string
    userId: string
    savedAt: Date
    expiresAt: Date
    _count: NewsFeedSaveCountAggregateOutputType | null
    _min: NewsFeedSaveMinAggregateOutputType | null
    _max: NewsFeedSaveMaxAggregateOutputType | null
  }

  type GetNewsFeedSaveGroupByPayload<T extends NewsFeedSaveGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsFeedSaveGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsFeedSaveGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsFeedSaveGroupByOutputType[P]>
            : GetScalarType<T[P], NewsFeedSaveGroupByOutputType[P]>
        }
      >
    >


  export type NewsFeedSaveSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    newsFeedItemId?: boolean
    userId?: boolean
    savedAt?: boolean
    expiresAt?: boolean
    newsFeedItem?: boolean | NewsFeedItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsFeedSave"]>



  export type NewsFeedSaveSelectScalar = {
    id?: boolean
    newsFeedItemId?: boolean
    userId?: boolean
    savedAt?: boolean
    expiresAt?: boolean
  }

  export type NewsFeedSaveOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "newsFeedItemId" | "userId" | "savedAt" | "expiresAt", ExtArgs["result"]["newsFeedSave"]>
  export type NewsFeedSaveInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsFeedItem?: boolean | NewsFeedItemDefaultArgs<ExtArgs>
  }

  export type $NewsFeedSavePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsFeedSave"
    objects: {
      newsFeedItem: Prisma.$NewsFeedItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      newsFeedItemId: string
      userId: string
      savedAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["newsFeedSave"]>
    composites: {}
  }

  type NewsFeedSaveGetPayload<S extends boolean | null | undefined | NewsFeedSaveDefaultArgs> = $Result.GetResult<Prisma.$NewsFeedSavePayload, S>

  type NewsFeedSaveCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsFeedSaveFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsFeedSaveCountAggregateInputType | true
    }

  export interface NewsFeedSaveDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsFeedSave'], meta: { name: 'NewsFeedSave' } }
    /**
     * Find zero or one NewsFeedSave that matches the filter.
     * @param {NewsFeedSaveFindUniqueArgs} args - Arguments to find a NewsFeedSave
     * @example
     * // Get one NewsFeedSave
     * const newsFeedSave = await prisma.newsFeedSave.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsFeedSaveFindUniqueArgs>(args: SelectSubset<T, NewsFeedSaveFindUniqueArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsFeedSave that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsFeedSaveFindUniqueOrThrowArgs} args - Arguments to find a NewsFeedSave
     * @example
     * // Get one NewsFeedSave
     * const newsFeedSave = await prisma.newsFeedSave.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsFeedSaveFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsFeedSaveFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedSave that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveFindFirstArgs} args - Arguments to find a NewsFeedSave
     * @example
     * // Get one NewsFeedSave
     * const newsFeedSave = await prisma.newsFeedSave.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsFeedSaveFindFirstArgs>(args?: SelectSubset<T, NewsFeedSaveFindFirstArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsFeedSave that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveFindFirstOrThrowArgs} args - Arguments to find a NewsFeedSave
     * @example
     * // Get one NewsFeedSave
     * const newsFeedSave = await prisma.newsFeedSave.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsFeedSaveFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsFeedSaveFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsFeedSaves that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsFeedSaves
     * const newsFeedSaves = await prisma.newsFeedSave.findMany()
     * 
     * // Get first 10 NewsFeedSaves
     * const newsFeedSaves = await prisma.newsFeedSave.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsFeedSaveWithIdOnly = await prisma.newsFeedSave.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsFeedSaveFindManyArgs>(args?: SelectSubset<T, NewsFeedSaveFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsFeedSave.
     * @param {NewsFeedSaveCreateArgs} args - Arguments to create a NewsFeedSave.
     * @example
     * // Create one NewsFeedSave
     * const NewsFeedSave = await prisma.newsFeedSave.create({
     *   data: {
     *     // ... data to create a NewsFeedSave
     *   }
     * })
     * 
     */
    create<T extends NewsFeedSaveCreateArgs>(args: SelectSubset<T, NewsFeedSaveCreateArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsFeedSaves.
     * @param {NewsFeedSaveCreateManyArgs} args - Arguments to create many NewsFeedSaves.
     * @example
     * // Create many NewsFeedSaves
     * const newsFeedSave = await prisma.newsFeedSave.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsFeedSaveCreateManyArgs>(args?: SelectSubset<T, NewsFeedSaveCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a NewsFeedSave.
     * @param {NewsFeedSaveDeleteArgs} args - Arguments to delete one NewsFeedSave.
     * @example
     * // Delete one NewsFeedSave
     * const NewsFeedSave = await prisma.newsFeedSave.delete({
     *   where: {
     *     // ... filter to delete one NewsFeedSave
     *   }
     * })
     * 
     */
    delete<T extends NewsFeedSaveDeleteArgs>(args: SelectSubset<T, NewsFeedSaveDeleteArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsFeedSave.
     * @param {NewsFeedSaveUpdateArgs} args - Arguments to update one NewsFeedSave.
     * @example
     * // Update one NewsFeedSave
     * const newsFeedSave = await prisma.newsFeedSave.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsFeedSaveUpdateArgs>(args: SelectSubset<T, NewsFeedSaveUpdateArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsFeedSaves.
     * @param {NewsFeedSaveDeleteManyArgs} args - Arguments to filter NewsFeedSaves to delete.
     * @example
     * // Delete a few NewsFeedSaves
     * const { count } = await prisma.newsFeedSave.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsFeedSaveDeleteManyArgs>(args?: SelectSubset<T, NewsFeedSaveDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsFeedSaves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsFeedSaves
     * const newsFeedSave = await prisma.newsFeedSave.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsFeedSaveUpdateManyArgs>(args: SelectSubset<T, NewsFeedSaveUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewsFeedSave.
     * @param {NewsFeedSaveUpsertArgs} args - Arguments to update or create a NewsFeedSave.
     * @example
     * // Update or create a NewsFeedSave
     * const newsFeedSave = await prisma.newsFeedSave.upsert({
     *   create: {
     *     // ... data to create a NewsFeedSave
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsFeedSave we want to update
     *   }
     * })
     */
    upsert<T extends NewsFeedSaveUpsertArgs>(args: SelectSubset<T, NewsFeedSaveUpsertArgs<ExtArgs>>): Prisma__NewsFeedSaveClient<$Result.GetResult<Prisma.$NewsFeedSavePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsFeedSaves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveCountArgs} args - Arguments to filter NewsFeedSaves to count.
     * @example
     * // Count the number of NewsFeedSaves
     * const count = await prisma.newsFeedSave.count({
     *   where: {
     *     // ... the filter for the NewsFeedSaves we want to count
     *   }
     * })
    **/
    count<T extends NewsFeedSaveCountArgs>(
      args?: Subset<T, NewsFeedSaveCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsFeedSaveCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsFeedSave.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NewsFeedSaveAggregateArgs>(args: Subset<T, NewsFeedSaveAggregateArgs>): Prisma.PrismaPromise<GetNewsFeedSaveAggregateType<T>>

    /**
     * Group by NewsFeedSave.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsFeedSaveGroupByArgs} args - Group by arguments.
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
      T extends NewsFeedSaveGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsFeedSaveGroupByArgs['orderBy'] }
        : { orderBy?: NewsFeedSaveGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NewsFeedSaveGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsFeedSaveGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsFeedSave model
   */
  readonly fields: NewsFeedSaveFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsFeedSave.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsFeedSaveClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    newsFeedItem<T extends NewsFeedItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NewsFeedItemDefaultArgs<ExtArgs>>): Prisma__NewsFeedItemClient<$Result.GetResult<Prisma.$NewsFeedItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the NewsFeedSave model
   */
  interface NewsFeedSaveFieldRefs {
    readonly id: FieldRef<"NewsFeedSave", 'String'>
    readonly newsFeedItemId: FieldRef<"NewsFeedSave", 'String'>
    readonly userId: FieldRef<"NewsFeedSave", 'String'>
    readonly savedAt: FieldRef<"NewsFeedSave", 'DateTime'>
    readonly expiresAt: FieldRef<"NewsFeedSave", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsFeedSave findUnique
   */
  export type NewsFeedSaveFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedSave to fetch.
     */
    where: NewsFeedSaveWhereUniqueInput
  }

  /**
   * NewsFeedSave findUniqueOrThrow
   */
  export type NewsFeedSaveFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedSave to fetch.
     */
    where: NewsFeedSaveWhereUniqueInput
  }

  /**
   * NewsFeedSave findFirst
   */
  export type NewsFeedSaveFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedSave to fetch.
     */
    where?: NewsFeedSaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedSaves to fetch.
     */
    orderBy?: NewsFeedSaveOrderByWithRelationInput | NewsFeedSaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedSaves.
     */
    cursor?: NewsFeedSaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedSaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedSaves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedSaves.
     */
    distinct?: NewsFeedSaveScalarFieldEnum | NewsFeedSaveScalarFieldEnum[]
  }

  /**
   * NewsFeedSave findFirstOrThrow
   */
  export type NewsFeedSaveFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedSave to fetch.
     */
    where?: NewsFeedSaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedSaves to fetch.
     */
    orderBy?: NewsFeedSaveOrderByWithRelationInput | NewsFeedSaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsFeedSaves.
     */
    cursor?: NewsFeedSaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedSaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedSaves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsFeedSaves.
     */
    distinct?: NewsFeedSaveScalarFieldEnum | NewsFeedSaveScalarFieldEnum[]
  }

  /**
   * NewsFeedSave findMany
   */
  export type NewsFeedSaveFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * Filter, which NewsFeedSaves to fetch.
     */
    where?: NewsFeedSaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsFeedSaves to fetch.
     */
    orderBy?: NewsFeedSaveOrderByWithRelationInput | NewsFeedSaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsFeedSaves.
     */
    cursor?: NewsFeedSaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsFeedSaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsFeedSaves.
     */
    skip?: number
    distinct?: NewsFeedSaveScalarFieldEnum | NewsFeedSaveScalarFieldEnum[]
  }

  /**
   * NewsFeedSave create
   */
  export type NewsFeedSaveCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsFeedSave.
     */
    data: XOR<NewsFeedSaveCreateInput, NewsFeedSaveUncheckedCreateInput>
  }

  /**
   * NewsFeedSave createMany
   */
  export type NewsFeedSaveCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsFeedSaves.
     */
    data: NewsFeedSaveCreateManyInput | NewsFeedSaveCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsFeedSave update
   */
  export type NewsFeedSaveUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsFeedSave.
     */
    data: XOR<NewsFeedSaveUpdateInput, NewsFeedSaveUncheckedUpdateInput>
    /**
     * Choose, which NewsFeedSave to update.
     */
    where: NewsFeedSaveWhereUniqueInput
  }

  /**
   * NewsFeedSave updateMany
   */
  export type NewsFeedSaveUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsFeedSaves.
     */
    data: XOR<NewsFeedSaveUpdateManyMutationInput, NewsFeedSaveUncheckedUpdateManyInput>
    /**
     * Filter which NewsFeedSaves to update
     */
    where?: NewsFeedSaveWhereInput
    /**
     * Limit how many NewsFeedSaves to update.
     */
    limit?: number
  }

  /**
   * NewsFeedSave upsert
   */
  export type NewsFeedSaveUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsFeedSave to update in case it exists.
     */
    where: NewsFeedSaveWhereUniqueInput
    /**
     * In case the NewsFeedSave found by the `where` argument doesn't exist, create a new NewsFeedSave with this data.
     */
    create: XOR<NewsFeedSaveCreateInput, NewsFeedSaveUncheckedCreateInput>
    /**
     * In case the NewsFeedSave was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsFeedSaveUpdateInput, NewsFeedSaveUncheckedUpdateInput>
  }

  /**
   * NewsFeedSave delete
   */
  export type NewsFeedSaveDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
    /**
     * Filter which NewsFeedSave to delete.
     */
    where: NewsFeedSaveWhereUniqueInput
  }

  /**
   * NewsFeedSave deleteMany
   */
  export type NewsFeedSaveDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsFeedSaves to delete
     */
    where?: NewsFeedSaveWhereInput
    /**
     * Limit how many NewsFeedSaves to delete.
     */
    limit?: number
  }

  /**
   * NewsFeedSave without action
   */
  export type NewsFeedSaveDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsFeedSave
     */
    select?: NewsFeedSaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsFeedSave
     */
    omit?: NewsFeedSaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsFeedSaveInclude<ExtArgs> | null
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


  export const NewsFeedItemScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    description: 'description',
    storeId: 'storeId',
    storeName: 'storeName',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type NewsFeedItemScalarFieldEnum = (typeof NewsFeedItemScalarFieldEnum)[keyof typeof NewsFeedItemScalarFieldEnum]


  export const NewsFeedLikeScalarFieldEnum: {
    id: 'id',
    newsFeedItemId: 'newsFeedItemId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type NewsFeedLikeScalarFieldEnum = (typeof NewsFeedLikeScalarFieldEnum)[keyof typeof NewsFeedLikeScalarFieldEnum]


  export const NewsFeedMetricStateScalarFieldEnum: {
    metric: 'metric',
    storeId: 'storeId',
    updatedAt: 'updatedAt'
  };

  export type NewsFeedMetricStateScalarFieldEnum = (typeof NewsFeedMetricStateScalarFieldEnum)[keyof typeof NewsFeedMetricStateScalarFieldEnum]


  export const NewsFeedSaveScalarFieldEnum: {
    id: 'id',
    newsFeedItemId: 'newsFeedItemId',
    userId: 'userId',
    savedAt: 'savedAt',
    expiresAt: 'expiresAt'
  };

  export type NewsFeedSaveScalarFieldEnum = (typeof NewsFeedSaveScalarFieldEnum)[keyof typeof NewsFeedSaveScalarFieldEnum]


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


  export const NewsFeedItemOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    storeName: 'storeName'
  };

  export type NewsFeedItemOrderByRelevanceFieldEnum = (typeof NewsFeedItemOrderByRelevanceFieldEnum)[keyof typeof NewsFeedItemOrderByRelevanceFieldEnum]


  export const NewsFeedLikeOrderByRelevanceFieldEnum: {
    id: 'id',
    newsFeedItemId: 'newsFeedItemId',
    userId: 'userId'
  };

  export type NewsFeedLikeOrderByRelevanceFieldEnum = (typeof NewsFeedLikeOrderByRelevanceFieldEnum)[keyof typeof NewsFeedLikeOrderByRelevanceFieldEnum]


  export const NewsFeedSaveOrderByRelevanceFieldEnum: {
    id: 'id',
    newsFeedItemId: 'newsFeedItemId',
    userId: 'userId'
  };

  export type NewsFeedSaveOrderByRelevanceFieldEnum = (typeof NewsFeedSaveOrderByRelevanceFieldEnum)[keyof typeof NewsFeedSaveOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'NewsFeedEventType'
   */
  export type EnumNewsFeedEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsFeedEventType'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


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
   * Reference to a field of type 'NewsFeedMetric'
   */
  export type EnumNewsFeedMetricFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsFeedMetric'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type NewsFeedItemWhereInput = {
    AND?: NewsFeedItemWhereInput | NewsFeedItemWhereInput[]
    OR?: NewsFeedItemWhereInput[]
    NOT?: NewsFeedItemWhereInput | NewsFeedItemWhereInput[]
    id?: StringFilter<"NewsFeedItem"> | string
    type?: EnumNewsFeedEventTypeFilter<"NewsFeedItem"> | $Enums.NewsFeedEventType
    title?: StringFilter<"NewsFeedItem"> | string
    description?: StringFilter<"NewsFeedItem"> | string
    storeId?: IntNullableFilter<"NewsFeedItem"> | number | null
    storeName?: StringNullableFilter<"NewsFeedItem"> | string | null
    metadata?: JsonNullableFilter<"NewsFeedItem">
    createdAt?: DateTimeFilter<"NewsFeedItem"> | Date | string
    likes?: NewsFeedLikeListRelationFilter
    saves?: NewsFeedSaveListRelationFilter
  }

  export type NewsFeedItemOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    storeId?: SortOrderInput | SortOrder
    storeName?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    likes?: NewsFeedLikeOrderByRelationAggregateInput
    saves?: NewsFeedSaveOrderByRelationAggregateInput
    _relevance?: NewsFeedItemOrderByRelevanceInput
  }

  export type NewsFeedItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NewsFeedItemWhereInput | NewsFeedItemWhereInput[]
    OR?: NewsFeedItemWhereInput[]
    NOT?: NewsFeedItemWhereInput | NewsFeedItemWhereInput[]
    type?: EnumNewsFeedEventTypeFilter<"NewsFeedItem"> | $Enums.NewsFeedEventType
    title?: StringFilter<"NewsFeedItem"> | string
    description?: StringFilter<"NewsFeedItem"> | string
    storeId?: IntNullableFilter<"NewsFeedItem"> | number | null
    storeName?: StringNullableFilter<"NewsFeedItem"> | string | null
    metadata?: JsonNullableFilter<"NewsFeedItem">
    createdAt?: DateTimeFilter<"NewsFeedItem"> | Date | string
    likes?: NewsFeedLikeListRelationFilter
    saves?: NewsFeedSaveListRelationFilter
  }, "id">

  export type NewsFeedItemOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    storeId?: SortOrderInput | SortOrder
    storeName?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NewsFeedItemCountOrderByAggregateInput
    _avg?: NewsFeedItemAvgOrderByAggregateInput
    _max?: NewsFeedItemMaxOrderByAggregateInput
    _min?: NewsFeedItemMinOrderByAggregateInput
    _sum?: NewsFeedItemSumOrderByAggregateInput
  }

  export type NewsFeedItemScalarWhereWithAggregatesInput = {
    AND?: NewsFeedItemScalarWhereWithAggregatesInput | NewsFeedItemScalarWhereWithAggregatesInput[]
    OR?: NewsFeedItemScalarWhereWithAggregatesInput[]
    NOT?: NewsFeedItemScalarWhereWithAggregatesInput | NewsFeedItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NewsFeedItem"> | string
    type?: EnumNewsFeedEventTypeWithAggregatesFilter<"NewsFeedItem"> | $Enums.NewsFeedEventType
    title?: StringWithAggregatesFilter<"NewsFeedItem"> | string
    description?: StringWithAggregatesFilter<"NewsFeedItem"> | string
    storeId?: IntNullableWithAggregatesFilter<"NewsFeedItem"> | number | null
    storeName?: StringNullableWithAggregatesFilter<"NewsFeedItem"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"NewsFeedItem">
    createdAt?: DateTimeWithAggregatesFilter<"NewsFeedItem"> | Date | string
  }

  export type NewsFeedLikeWhereInput = {
    AND?: NewsFeedLikeWhereInput | NewsFeedLikeWhereInput[]
    OR?: NewsFeedLikeWhereInput[]
    NOT?: NewsFeedLikeWhereInput | NewsFeedLikeWhereInput[]
    id?: StringFilter<"NewsFeedLike"> | string
    newsFeedItemId?: StringFilter<"NewsFeedLike"> | string
    userId?: StringFilter<"NewsFeedLike"> | string
    createdAt?: DateTimeFilter<"NewsFeedLike"> | Date | string
    newsFeedItem?: XOR<NewsFeedItemScalarRelationFilter, NewsFeedItemWhereInput>
  }

  export type NewsFeedLikeOrderByWithRelationInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    newsFeedItem?: NewsFeedItemOrderByWithRelationInput
    _relevance?: NewsFeedLikeOrderByRelevanceInput
  }

  export type NewsFeedLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    newsFeedItemId_userId?: NewsFeedLikeNewsFeedItemIdUserIdCompoundUniqueInput
    AND?: NewsFeedLikeWhereInput | NewsFeedLikeWhereInput[]
    OR?: NewsFeedLikeWhereInput[]
    NOT?: NewsFeedLikeWhereInput | NewsFeedLikeWhereInput[]
    newsFeedItemId?: StringFilter<"NewsFeedLike"> | string
    userId?: StringFilter<"NewsFeedLike"> | string
    createdAt?: DateTimeFilter<"NewsFeedLike"> | Date | string
    newsFeedItem?: XOR<NewsFeedItemScalarRelationFilter, NewsFeedItemWhereInput>
  }, "id" | "newsFeedItemId_userId">

  export type NewsFeedLikeOrderByWithAggregationInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: NewsFeedLikeCountOrderByAggregateInput
    _max?: NewsFeedLikeMaxOrderByAggregateInput
    _min?: NewsFeedLikeMinOrderByAggregateInput
  }

  export type NewsFeedLikeScalarWhereWithAggregatesInput = {
    AND?: NewsFeedLikeScalarWhereWithAggregatesInput | NewsFeedLikeScalarWhereWithAggregatesInput[]
    OR?: NewsFeedLikeScalarWhereWithAggregatesInput[]
    NOT?: NewsFeedLikeScalarWhereWithAggregatesInput | NewsFeedLikeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NewsFeedLike"> | string
    newsFeedItemId?: StringWithAggregatesFilter<"NewsFeedLike"> | string
    userId?: StringWithAggregatesFilter<"NewsFeedLike"> | string
    createdAt?: DateTimeWithAggregatesFilter<"NewsFeedLike"> | Date | string
  }

  export type NewsFeedMetricStateWhereInput = {
    AND?: NewsFeedMetricStateWhereInput | NewsFeedMetricStateWhereInput[]
    OR?: NewsFeedMetricStateWhereInput[]
    NOT?: NewsFeedMetricStateWhereInput | NewsFeedMetricStateWhereInput[]
    metric?: EnumNewsFeedMetricFilter<"NewsFeedMetricState"> | $Enums.NewsFeedMetric
    storeId?: IntNullableFilter<"NewsFeedMetricState"> | number | null
    updatedAt?: DateTimeFilter<"NewsFeedMetricState"> | Date | string
  }

  export type NewsFeedMetricStateOrderByWithRelationInput = {
    metric?: SortOrder
    storeId?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type NewsFeedMetricStateWhereUniqueInput = Prisma.AtLeast<{
    metric?: $Enums.NewsFeedMetric
    AND?: NewsFeedMetricStateWhereInput | NewsFeedMetricStateWhereInput[]
    OR?: NewsFeedMetricStateWhereInput[]
    NOT?: NewsFeedMetricStateWhereInput | NewsFeedMetricStateWhereInput[]
    storeId?: IntNullableFilter<"NewsFeedMetricState"> | number | null
    updatedAt?: DateTimeFilter<"NewsFeedMetricState"> | Date | string
  }, "metric">

  export type NewsFeedMetricStateOrderByWithAggregationInput = {
    metric?: SortOrder
    storeId?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: NewsFeedMetricStateCountOrderByAggregateInput
    _avg?: NewsFeedMetricStateAvgOrderByAggregateInput
    _max?: NewsFeedMetricStateMaxOrderByAggregateInput
    _min?: NewsFeedMetricStateMinOrderByAggregateInput
    _sum?: NewsFeedMetricStateSumOrderByAggregateInput
  }

  export type NewsFeedMetricStateScalarWhereWithAggregatesInput = {
    AND?: NewsFeedMetricStateScalarWhereWithAggregatesInput | NewsFeedMetricStateScalarWhereWithAggregatesInput[]
    OR?: NewsFeedMetricStateScalarWhereWithAggregatesInput[]
    NOT?: NewsFeedMetricStateScalarWhereWithAggregatesInput | NewsFeedMetricStateScalarWhereWithAggregatesInput[]
    metric?: EnumNewsFeedMetricWithAggregatesFilter<"NewsFeedMetricState"> | $Enums.NewsFeedMetric
    storeId?: IntNullableWithAggregatesFilter<"NewsFeedMetricState"> | number | null
    updatedAt?: DateTimeWithAggregatesFilter<"NewsFeedMetricState"> | Date | string
  }

  export type NewsFeedSaveWhereInput = {
    AND?: NewsFeedSaveWhereInput | NewsFeedSaveWhereInput[]
    OR?: NewsFeedSaveWhereInput[]
    NOT?: NewsFeedSaveWhereInput | NewsFeedSaveWhereInput[]
    id?: StringFilter<"NewsFeedSave"> | string
    newsFeedItemId?: StringFilter<"NewsFeedSave"> | string
    userId?: StringFilter<"NewsFeedSave"> | string
    savedAt?: DateTimeFilter<"NewsFeedSave"> | Date | string
    expiresAt?: DateTimeFilter<"NewsFeedSave"> | Date | string
    newsFeedItem?: XOR<NewsFeedItemScalarRelationFilter, NewsFeedItemWhereInput>
  }

  export type NewsFeedSaveOrderByWithRelationInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    savedAt?: SortOrder
    expiresAt?: SortOrder
    newsFeedItem?: NewsFeedItemOrderByWithRelationInput
    _relevance?: NewsFeedSaveOrderByRelevanceInput
  }

  export type NewsFeedSaveWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    newsFeedItemId_userId?: NewsFeedSaveNewsFeedItemIdUserIdCompoundUniqueInput
    AND?: NewsFeedSaveWhereInput | NewsFeedSaveWhereInput[]
    OR?: NewsFeedSaveWhereInput[]
    NOT?: NewsFeedSaveWhereInput | NewsFeedSaveWhereInput[]
    newsFeedItemId?: StringFilter<"NewsFeedSave"> | string
    userId?: StringFilter<"NewsFeedSave"> | string
    savedAt?: DateTimeFilter<"NewsFeedSave"> | Date | string
    expiresAt?: DateTimeFilter<"NewsFeedSave"> | Date | string
    newsFeedItem?: XOR<NewsFeedItemScalarRelationFilter, NewsFeedItemWhereInput>
  }, "id" | "newsFeedItemId_userId">

  export type NewsFeedSaveOrderByWithAggregationInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    savedAt?: SortOrder
    expiresAt?: SortOrder
    _count?: NewsFeedSaveCountOrderByAggregateInput
    _max?: NewsFeedSaveMaxOrderByAggregateInput
    _min?: NewsFeedSaveMinOrderByAggregateInput
  }

  export type NewsFeedSaveScalarWhereWithAggregatesInput = {
    AND?: NewsFeedSaveScalarWhereWithAggregatesInput | NewsFeedSaveScalarWhereWithAggregatesInput[]
    OR?: NewsFeedSaveScalarWhereWithAggregatesInput[]
    NOT?: NewsFeedSaveScalarWhereWithAggregatesInput | NewsFeedSaveScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NewsFeedSave"> | string
    newsFeedItemId?: StringWithAggregatesFilter<"NewsFeedSave"> | string
    userId?: StringWithAggregatesFilter<"NewsFeedSave"> | string
    savedAt?: DateTimeWithAggregatesFilter<"NewsFeedSave"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"NewsFeedSave"> | Date | string
  }

  export type NewsFeedItemCreateInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    likes?: NewsFeedLikeCreateNestedManyWithoutNewsFeedItemInput
    saves?: NewsFeedSaveCreateNestedManyWithoutNewsFeedItemInput
  }

  export type NewsFeedItemUncheckedCreateInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    likes?: NewsFeedLikeUncheckedCreateNestedManyWithoutNewsFeedItemInput
    saves?: NewsFeedSaveUncheckedCreateNestedManyWithoutNewsFeedItemInput
  }

  export type NewsFeedItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: NewsFeedLikeUpdateManyWithoutNewsFeedItemNestedInput
    saves?: NewsFeedSaveUpdateManyWithoutNewsFeedItemNestedInput
  }

  export type NewsFeedItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: NewsFeedLikeUncheckedUpdateManyWithoutNewsFeedItemNestedInput
    saves?: NewsFeedSaveUncheckedUpdateManyWithoutNewsFeedItemNestedInput
  }

  export type NewsFeedItemCreateManyInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type NewsFeedItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedLikeCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    newsFeedItem: NewsFeedItemCreateNestedOneWithoutLikesInput
  }

  export type NewsFeedLikeUncheckedCreateInput = {
    id?: string
    newsFeedItemId: string
    userId: string
    createdAt?: Date | string
  }

  export type NewsFeedLikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsFeedItem?: NewsFeedItemUpdateOneRequiredWithoutLikesNestedInput
  }

  export type NewsFeedLikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsFeedItemId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedLikeCreateManyInput = {
    id?: string
    newsFeedItemId: string
    userId: string
    createdAt?: Date | string
  }

  export type NewsFeedLikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedLikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsFeedItemId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedMetricStateCreateInput = {
    metric: $Enums.NewsFeedMetric
    storeId?: number | null
    updatedAt?: Date | string
  }

  export type NewsFeedMetricStateUncheckedCreateInput = {
    metric: $Enums.NewsFeedMetric
    storeId?: number | null
    updatedAt?: Date | string
  }

  export type NewsFeedMetricStateUpdateInput = {
    metric?: EnumNewsFeedMetricFieldUpdateOperationsInput | $Enums.NewsFeedMetric
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedMetricStateUncheckedUpdateInput = {
    metric?: EnumNewsFeedMetricFieldUpdateOperationsInput | $Enums.NewsFeedMetric
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedMetricStateCreateManyInput = {
    metric: $Enums.NewsFeedMetric
    storeId?: number | null
    updatedAt?: Date | string
  }

  export type NewsFeedMetricStateUpdateManyMutationInput = {
    metric?: EnumNewsFeedMetricFieldUpdateOperationsInput | $Enums.NewsFeedMetric
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedMetricStateUncheckedUpdateManyInput = {
    metric?: EnumNewsFeedMetricFieldUpdateOperationsInput | $Enums.NewsFeedMetric
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedSaveCreateInput = {
    id?: string
    userId: string
    savedAt?: Date | string
    expiresAt: Date | string
    newsFeedItem: NewsFeedItemCreateNestedOneWithoutSavesInput
  }

  export type NewsFeedSaveUncheckedCreateInput = {
    id?: string
    newsFeedItemId: string
    userId: string
    savedAt?: Date | string
    expiresAt: Date | string
  }

  export type NewsFeedSaveUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsFeedItem?: NewsFeedItemUpdateOneRequiredWithoutSavesNestedInput
  }

  export type NewsFeedSaveUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsFeedItemId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedSaveCreateManyInput = {
    id?: string
    newsFeedItemId: string
    userId: string
    savedAt?: Date | string
    expiresAt: Date | string
  }

  export type NewsFeedSaveUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedSaveUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsFeedItemId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumNewsFeedEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedEventType | EnumNewsFeedEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedEventType[]
    notIn?: $Enums.NewsFeedEventType[]
    not?: NestedEnumNewsFeedEventTypeFilter<$PrismaModel> | $Enums.NewsFeedEventType
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
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

  export type NewsFeedLikeListRelationFilter = {
    every?: NewsFeedLikeWhereInput
    some?: NewsFeedLikeWhereInput
    none?: NewsFeedLikeWhereInput
  }

  export type NewsFeedSaveListRelationFilter = {
    every?: NewsFeedSaveWhereInput
    some?: NewsFeedSaveWhereInput
    none?: NewsFeedSaveWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type NewsFeedLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NewsFeedSaveOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NewsFeedItemOrderByRelevanceInput = {
    fields: NewsFeedItemOrderByRelevanceFieldEnum | NewsFeedItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NewsFeedItemCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    storeId?: SortOrder
    storeName?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsFeedItemAvgOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type NewsFeedItemMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    storeId?: SortOrder
    storeName?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsFeedItemMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    storeId?: SortOrder
    storeName?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsFeedItemSumOrderByAggregateInput = {
    storeId?: SortOrder
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

  export type EnumNewsFeedEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedEventType | EnumNewsFeedEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedEventType[]
    notIn?: $Enums.NewsFeedEventType[]
    not?: NestedEnumNewsFeedEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.NewsFeedEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsFeedEventTypeFilter<$PrismaModel>
    _max?: NestedEnumNewsFeedEventTypeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type NewsFeedItemScalarRelationFilter = {
    is?: NewsFeedItemWhereInput
    isNot?: NewsFeedItemWhereInput
  }

  export type NewsFeedLikeOrderByRelevanceInput = {
    fields: NewsFeedLikeOrderByRelevanceFieldEnum | NewsFeedLikeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NewsFeedLikeNewsFeedItemIdUserIdCompoundUniqueInput = {
    newsFeedItemId: string
    userId: string
  }

  export type NewsFeedLikeCountOrderByAggregateInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsFeedLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsFeedLikeMinOrderByAggregateInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNewsFeedMetricFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedMetric | EnumNewsFeedMetricFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedMetric[]
    notIn?: $Enums.NewsFeedMetric[]
    not?: NestedEnumNewsFeedMetricFilter<$PrismaModel> | $Enums.NewsFeedMetric
  }

  export type NewsFeedMetricStateCountOrderByAggregateInput = {
    metric?: SortOrder
    storeId?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewsFeedMetricStateAvgOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type NewsFeedMetricStateMaxOrderByAggregateInput = {
    metric?: SortOrder
    storeId?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewsFeedMetricStateMinOrderByAggregateInput = {
    metric?: SortOrder
    storeId?: SortOrder
    updatedAt?: SortOrder
  }

  export type NewsFeedMetricStateSumOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type EnumNewsFeedMetricWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedMetric | EnumNewsFeedMetricFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedMetric[]
    notIn?: $Enums.NewsFeedMetric[]
    not?: NestedEnumNewsFeedMetricWithAggregatesFilter<$PrismaModel> | $Enums.NewsFeedMetric
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsFeedMetricFilter<$PrismaModel>
    _max?: NestedEnumNewsFeedMetricFilter<$PrismaModel>
  }

  export type NewsFeedSaveOrderByRelevanceInput = {
    fields: NewsFeedSaveOrderByRelevanceFieldEnum | NewsFeedSaveOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NewsFeedSaveNewsFeedItemIdUserIdCompoundUniqueInput = {
    newsFeedItemId: string
    userId: string
  }

  export type NewsFeedSaveCountOrderByAggregateInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    savedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type NewsFeedSaveMaxOrderByAggregateInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    savedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type NewsFeedSaveMinOrderByAggregateInput = {
    id?: SortOrder
    newsFeedItemId?: SortOrder
    userId?: SortOrder
    savedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type NewsFeedLikeCreateNestedManyWithoutNewsFeedItemInput = {
    create?: XOR<NewsFeedLikeCreateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedLikeCreateWithoutNewsFeedItemInput[] | NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput | NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput[]
    createMany?: NewsFeedLikeCreateManyNewsFeedItemInputEnvelope
    connect?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
  }

  export type NewsFeedSaveCreateNestedManyWithoutNewsFeedItemInput = {
    create?: XOR<NewsFeedSaveCreateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedSaveCreateWithoutNewsFeedItemInput[] | NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput | NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput[]
    createMany?: NewsFeedSaveCreateManyNewsFeedItemInputEnvelope
    connect?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
  }

  export type NewsFeedLikeUncheckedCreateNestedManyWithoutNewsFeedItemInput = {
    create?: XOR<NewsFeedLikeCreateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedLikeCreateWithoutNewsFeedItemInput[] | NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput | NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput[]
    createMany?: NewsFeedLikeCreateManyNewsFeedItemInputEnvelope
    connect?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
  }

  export type NewsFeedSaveUncheckedCreateNestedManyWithoutNewsFeedItemInput = {
    create?: XOR<NewsFeedSaveCreateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedSaveCreateWithoutNewsFeedItemInput[] | NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput | NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput[]
    createMany?: NewsFeedSaveCreateManyNewsFeedItemInputEnvelope
    connect?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumNewsFeedEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.NewsFeedEventType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NewsFeedLikeUpdateManyWithoutNewsFeedItemNestedInput = {
    create?: XOR<NewsFeedLikeCreateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedLikeCreateWithoutNewsFeedItemInput[] | NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput | NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput[]
    upsert?: NewsFeedLikeUpsertWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedLikeUpsertWithWhereUniqueWithoutNewsFeedItemInput[]
    createMany?: NewsFeedLikeCreateManyNewsFeedItemInputEnvelope
    set?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    disconnect?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    delete?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    connect?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    update?: NewsFeedLikeUpdateWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedLikeUpdateWithWhereUniqueWithoutNewsFeedItemInput[]
    updateMany?: NewsFeedLikeUpdateManyWithWhereWithoutNewsFeedItemInput | NewsFeedLikeUpdateManyWithWhereWithoutNewsFeedItemInput[]
    deleteMany?: NewsFeedLikeScalarWhereInput | NewsFeedLikeScalarWhereInput[]
  }

  export type NewsFeedSaveUpdateManyWithoutNewsFeedItemNestedInput = {
    create?: XOR<NewsFeedSaveCreateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedSaveCreateWithoutNewsFeedItemInput[] | NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput | NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput[]
    upsert?: NewsFeedSaveUpsertWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedSaveUpsertWithWhereUniqueWithoutNewsFeedItemInput[]
    createMany?: NewsFeedSaveCreateManyNewsFeedItemInputEnvelope
    set?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    disconnect?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    delete?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    connect?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    update?: NewsFeedSaveUpdateWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedSaveUpdateWithWhereUniqueWithoutNewsFeedItemInput[]
    updateMany?: NewsFeedSaveUpdateManyWithWhereWithoutNewsFeedItemInput | NewsFeedSaveUpdateManyWithWhereWithoutNewsFeedItemInput[]
    deleteMany?: NewsFeedSaveScalarWhereInput | NewsFeedSaveScalarWhereInput[]
  }

  export type NewsFeedLikeUncheckedUpdateManyWithoutNewsFeedItemNestedInput = {
    create?: XOR<NewsFeedLikeCreateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedLikeCreateWithoutNewsFeedItemInput[] | NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput | NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput[]
    upsert?: NewsFeedLikeUpsertWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedLikeUpsertWithWhereUniqueWithoutNewsFeedItemInput[]
    createMany?: NewsFeedLikeCreateManyNewsFeedItemInputEnvelope
    set?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    disconnect?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    delete?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    connect?: NewsFeedLikeWhereUniqueInput | NewsFeedLikeWhereUniqueInput[]
    update?: NewsFeedLikeUpdateWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedLikeUpdateWithWhereUniqueWithoutNewsFeedItemInput[]
    updateMany?: NewsFeedLikeUpdateManyWithWhereWithoutNewsFeedItemInput | NewsFeedLikeUpdateManyWithWhereWithoutNewsFeedItemInput[]
    deleteMany?: NewsFeedLikeScalarWhereInput | NewsFeedLikeScalarWhereInput[]
  }

  export type NewsFeedSaveUncheckedUpdateManyWithoutNewsFeedItemNestedInput = {
    create?: XOR<NewsFeedSaveCreateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput> | NewsFeedSaveCreateWithoutNewsFeedItemInput[] | NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput[]
    connectOrCreate?: NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput | NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput[]
    upsert?: NewsFeedSaveUpsertWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedSaveUpsertWithWhereUniqueWithoutNewsFeedItemInput[]
    createMany?: NewsFeedSaveCreateManyNewsFeedItemInputEnvelope
    set?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    disconnect?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    delete?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    connect?: NewsFeedSaveWhereUniqueInput | NewsFeedSaveWhereUniqueInput[]
    update?: NewsFeedSaveUpdateWithWhereUniqueWithoutNewsFeedItemInput | NewsFeedSaveUpdateWithWhereUniqueWithoutNewsFeedItemInput[]
    updateMany?: NewsFeedSaveUpdateManyWithWhereWithoutNewsFeedItemInput | NewsFeedSaveUpdateManyWithWhereWithoutNewsFeedItemInput[]
    deleteMany?: NewsFeedSaveScalarWhereInput | NewsFeedSaveScalarWhereInput[]
  }

  export type NewsFeedItemCreateNestedOneWithoutLikesInput = {
    create?: XOR<NewsFeedItemCreateWithoutLikesInput, NewsFeedItemUncheckedCreateWithoutLikesInput>
    connectOrCreate?: NewsFeedItemCreateOrConnectWithoutLikesInput
    connect?: NewsFeedItemWhereUniqueInput
  }

  export type NewsFeedItemUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<NewsFeedItemCreateWithoutLikesInput, NewsFeedItemUncheckedCreateWithoutLikesInput>
    connectOrCreate?: NewsFeedItemCreateOrConnectWithoutLikesInput
    upsert?: NewsFeedItemUpsertWithoutLikesInput
    connect?: NewsFeedItemWhereUniqueInput
    update?: XOR<XOR<NewsFeedItemUpdateToOneWithWhereWithoutLikesInput, NewsFeedItemUpdateWithoutLikesInput>, NewsFeedItemUncheckedUpdateWithoutLikesInput>
  }

  export type EnumNewsFeedMetricFieldUpdateOperationsInput = {
    set?: $Enums.NewsFeedMetric
  }

  export type NewsFeedItemCreateNestedOneWithoutSavesInput = {
    create?: XOR<NewsFeedItemCreateWithoutSavesInput, NewsFeedItemUncheckedCreateWithoutSavesInput>
    connectOrCreate?: NewsFeedItemCreateOrConnectWithoutSavesInput
    connect?: NewsFeedItemWhereUniqueInput
  }

  export type NewsFeedItemUpdateOneRequiredWithoutSavesNestedInput = {
    create?: XOR<NewsFeedItemCreateWithoutSavesInput, NewsFeedItemUncheckedCreateWithoutSavesInput>
    connectOrCreate?: NewsFeedItemCreateOrConnectWithoutSavesInput
    upsert?: NewsFeedItemUpsertWithoutSavesInput
    connect?: NewsFeedItemWhereUniqueInput
    update?: XOR<XOR<NewsFeedItemUpdateToOneWithWhereWithoutSavesInput, NewsFeedItemUpdateWithoutSavesInput>, NewsFeedItemUncheckedUpdateWithoutSavesInput>
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

  export type NestedEnumNewsFeedEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedEventType | EnumNewsFeedEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedEventType[]
    notIn?: $Enums.NewsFeedEventType[]
    not?: NestedEnumNewsFeedEventTypeFilter<$PrismaModel> | $Enums.NewsFeedEventType
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

  export type NestedEnumNewsFeedEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedEventType | EnumNewsFeedEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedEventType[]
    notIn?: $Enums.NewsFeedEventType[]
    not?: NestedEnumNewsFeedEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.NewsFeedEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsFeedEventTypeFilter<$PrismaModel>
    _max?: NestedEnumNewsFeedEventTypeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type NestedEnumNewsFeedMetricFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedMetric | EnumNewsFeedMetricFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedMetric[]
    notIn?: $Enums.NewsFeedMetric[]
    not?: NestedEnumNewsFeedMetricFilter<$PrismaModel> | $Enums.NewsFeedMetric
  }

  export type NestedEnumNewsFeedMetricWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsFeedMetric | EnumNewsFeedMetricFieldRefInput<$PrismaModel>
    in?: $Enums.NewsFeedMetric[]
    notIn?: $Enums.NewsFeedMetric[]
    not?: NestedEnumNewsFeedMetricWithAggregatesFilter<$PrismaModel> | $Enums.NewsFeedMetric
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsFeedMetricFilter<$PrismaModel>
    _max?: NestedEnumNewsFeedMetricFilter<$PrismaModel>
  }

  export type NewsFeedLikeCreateWithoutNewsFeedItemInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type NewsFeedLikeCreateOrConnectWithoutNewsFeedItemInput = {
    where: NewsFeedLikeWhereUniqueInput
    create: XOR<NewsFeedLikeCreateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput>
  }

  export type NewsFeedLikeCreateManyNewsFeedItemInputEnvelope = {
    data: NewsFeedLikeCreateManyNewsFeedItemInput | NewsFeedLikeCreateManyNewsFeedItemInput[]
    skipDuplicates?: boolean
  }

  export type NewsFeedSaveCreateWithoutNewsFeedItemInput = {
    id?: string
    userId: string
    savedAt?: Date | string
    expiresAt: Date | string
  }

  export type NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput = {
    id?: string
    userId: string
    savedAt?: Date | string
    expiresAt: Date | string
  }

  export type NewsFeedSaveCreateOrConnectWithoutNewsFeedItemInput = {
    where: NewsFeedSaveWhereUniqueInput
    create: XOR<NewsFeedSaveCreateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput>
  }

  export type NewsFeedSaveCreateManyNewsFeedItemInputEnvelope = {
    data: NewsFeedSaveCreateManyNewsFeedItemInput | NewsFeedSaveCreateManyNewsFeedItemInput[]
    skipDuplicates?: boolean
  }

  export type NewsFeedLikeUpsertWithWhereUniqueWithoutNewsFeedItemInput = {
    where: NewsFeedLikeWhereUniqueInput
    update: XOR<NewsFeedLikeUpdateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedUpdateWithoutNewsFeedItemInput>
    create: XOR<NewsFeedLikeCreateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedCreateWithoutNewsFeedItemInput>
  }

  export type NewsFeedLikeUpdateWithWhereUniqueWithoutNewsFeedItemInput = {
    where: NewsFeedLikeWhereUniqueInput
    data: XOR<NewsFeedLikeUpdateWithoutNewsFeedItemInput, NewsFeedLikeUncheckedUpdateWithoutNewsFeedItemInput>
  }

  export type NewsFeedLikeUpdateManyWithWhereWithoutNewsFeedItemInput = {
    where: NewsFeedLikeScalarWhereInput
    data: XOR<NewsFeedLikeUpdateManyMutationInput, NewsFeedLikeUncheckedUpdateManyWithoutNewsFeedItemInput>
  }

  export type NewsFeedLikeScalarWhereInput = {
    AND?: NewsFeedLikeScalarWhereInput | NewsFeedLikeScalarWhereInput[]
    OR?: NewsFeedLikeScalarWhereInput[]
    NOT?: NewsFeedLikeScalarWhereInput | NewsFeedLikeScalarWhereInput[]
    id?: StringFilter<"NewsFeedLike"> | string
    newsFeedItemId?: StringFilter<"NewsFeedLike"> | string
    userId?: StringFilter<"NewsFeedLike"> | string
    createdAt?: DateTimeFilter<"NewsFeedLike"> | Date | string
  }

  export type NewsFeedSaveUpsertWithWhereUniqueWithoutNewsFeedItemInput = {
    where: NewsFeedSaveWhereUniqueInput
    update: XOR<NewsFeedSaveUpdateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedUpdateWithoutNewsFeedItemInput>
    create: XOR<NewsFeedSaveCreateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedCreateWithoutNewsFeedItemInput>
  }

  export type NewsFeedSaveUpdateWithWhereUniqueWithoutNewsFeedItemInput = {
    where: NewsFeedSaveWhereUniqueInput
    data: XOR<NewsFeedSaveUpdateWithoutNewsFeedItemInput, NewsFeedSaveUncheckedUpdateWithoutNewsFeedItemInput>
  }

  export type NewsFeedSaveUpdateManyWithWhereWithoutNewsFeedItemInput = {
    where: NewsFeedSaveScalarWhereInput
    data: XOR<NewsFeedSaveUpdateManyMutationInput, NewsFeedSaveUncheckedUpdateManyWithoutNewsFeedItemInput>
  }

  export type NewsFeedSaveScalarWhereInput = {
    AND?: NewsFeedSaveScalarWhereInput | NewsFeedSaveScalarWhereInput[]
    OR?: NewsFeedSaveScalarWhereInput[]
    NOT?: NewsFeedSaveScalarWhereInput | NewsFeedSaveScalarWhereInput[]
    id?: StringFilter<"NewsFeedSave"> | string
    newsFeedItemId?: StringFilter<"NewsFeedSave"> | string
    userId?: StringFilter<"NewsFeedSave"> | string
    savedAt?: DateTimeFilter<"NewsFeedSave"> | Date | string
    expiresAt?: DateTimeFilter<"NewsFeedSave"> | Date | string
  }

  export type NewsFeedItemCreateWithoutLikesInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    saves?: NewsFeedSaveCreateNestedManyWithoutNewsFeedItemInput
  }

  export type NewsFeedItemUncheckedCreateWithoutLikesInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    saves?: NewsFeedSaveUncheckedCreateNestedManyWithoutNewsFeedItemInput
  }

  export type NewsFeedItemCreateOrConnectWithoutLikesInput = {
    where: NewsFeedItemWhereUniqueInput
    create: XOR<NewsFeedItemCreateWithoutLikesInput, NewsFeedItemUncheckedCreateWithoutLikesInput>
  }

  export type NewsFeedItemUpsertWithoutLikesInput = {
    update: XOR<NewsFeedItemUpdateWithoutLikesInput, NewsFeedItemUncheckedUpdateWithoutLikesInput>
    create: XOR<NewsFeedItemCreateWithoutLikesInput, NewsFeedItemUncheckedCreateWithoutLikesInput>
    where?: NewsFeedItemWhereInput
  }

  export type NewsFeedItemUpdateToOneWithWhereWithoutLikesInput = {
    where?: NewsFeedItemWhereInput
    data: XOR<NewsFeedItemUpdateWithoutLikesInput, NewsFeedItemUncheckedUpdateWithoutLikesInput>
  }

  export type NewsFeedItemUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saves?: NewsFeedSaveUpdateManyWithoutNewsFeedItemNestedInput
  }

  export type NewsFeedItemUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saves?: NewsFeedSaveUncheckedUpdateManyWithoutNewsFeedItemNestedInput
  }

  export type NewsFeedItemCreateWithoutSavesInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    likes?: NewsFeedLikeCreateNestedManyWithoutNewsFeedItemInput
  }

  export type NewsFeedItemUncheckedCreateWithoutSavesInput = {
    id?: string
    type: $Enums.NewsFeedEventType
    title: string
    description: string
    storeId?: number | null
    storeName?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    likes?: NewsFeedLikeUncheckedCreateNestedManyWithoutNewsFeedItemInput
  }

  export type NewsFeedItemCreateOrConnectWithoutSavesInput = {
    where: NewsFeedItemWhereUniqueInput
    create: XOR<NewsFeedItemCreateWithoutSavesInput, NewsFeedItemUncheckedCreateWithoutSavesInput>
  }

  export type NewsFeedItemUpsertWithoutSavesInput = {
    update: XOR<NewsFeedItemUpdateWithoutSavesInput, NewsFeedItemUncheckedUpdateWithoutSavesInput>
    create: XOR<NewsFeedItemCreateWithoutSavesInput, NewsFeedItemUncheckedCreateWithoutSavesInput>
    where?: NewsFeedItemWhereInput
  }

  export type NewsFeedItemUpdateToOneWithWhereWithoutSavesInput = {
    where?: NewsFeedItemWhereInput
    data: XOR<NewsFeedItemUpdateWithoutSavesInput, NewsFeedItemUncheckedUpdateWithoutSavesInput>
  }

  export type NewsFeedItemUpdateWithoutSavesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: NewsFeedLikeUpdateManyWithoutNewsFeedItemNestedInput
  }

  export type NewsFeedItemUncheckedUpdateWithoutSavesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumNewsFeedEventTypeFieldUpdateOperationsInput | $Enums.NewsFeedEventType
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    storeId?: NullableIntFieldUpdateOperationsInput | number | null
    storeName?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: NewsFeedLikeUncheckedUpdateManyWithoutNewsFeedItemNestedInput
  }

  export type NewsFeedLikeCreateManyNewsFeedItemInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type NewsFeedSaveCreateManyNewsFeedItemInput = {
    id?: string
    userId: string
    savedAt?: Date | string
    expiresAt: Date | string
  }

  export type NewsFeedLikeUpdateWithoutNewsFeedItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedLikeUncheckedUpdateWithoutNewsFeedItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedLikeUncheckedUpdateManyWithoutNewsFeedItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedSaveUpdateWithoutNewsFeedItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedSaveUncheckedUpdateWithoutNewsFeedItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsFeedSaveUncheckedUpdateManyWithoutNewsFeedItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
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