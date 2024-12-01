import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','email','name','createdAt','updatedAt']);

export const PRDScalarFieldEnumSchema = z.enum(['id','appName','appDescription','progLanguage','framework','styling','backend','auth','payments','otherPackages','llmProcessed','llmResponse','createdAt','updatedAt','userId']);

export const PageScalarFieldEnumSchema = z.enum(['id','pageName','pageDescription','orderIndex','status','llmProcessed','llmResponse','createdAt','updatedAt','lastProcessed','prdId']);

export const ImplementationScalarFieldEnumSchema = z.enum(['id','setupSteps','fileStructure','dependencies','deploymentGuide','llmProcessed','llmResponse','createdAt','updatedAt','lastProcessed','prdId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  clerkId: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PRD SCHEMA
/////////////////////////////////////////

export const PRDSchema = z.object({
  id: z.string().cuid(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean(),
  llmResponse: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
})

export type PRD = z.infer<typeof PRDSchema>

/////////////////////////////////////////
// PAGE SCHEMA
/////////////////////////////////////////

export const PageSchema = z.object({
  id: z.string().cuid(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string(),
  llmProcessed: z.boolean(),
  llmResponse: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastProcessed: z.coerce.date().nullable(),
  prdId: z.string(),
})

export type Page = z.infer<typeof PageSchema>

/////////////////////////////////////////
// IMPLEMENTATION SCHEMA
/////////////////////////////////////////

export const ImplementationSchema = z.object({
  id: z.string().cuid(),
  setupSteps: JsonValueSchema,
  fileStructure: JsonValueSchema,
  dependencies: JsonValueSchema,
  deploymentGuide: JsonValueSchema,
  llmProcessed: z.boolean(),
  llmResponse: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastProcessed: z.coerce.date().nullable(),
  prdId: z.string(),
})

export type Implementation = z.infer<typeof ImplementationSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  prds: z.union([z.boolean(),z.lazy(() => PRDFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  prds: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  clerkId: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  prds: z.union([z.boolean(),z.lazy(() => PRDFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PRD
//------------------------------------------------------

export const PRDIncludeSchema: z.ZodType<Prisma.PRDInclude> = z.object({
  implementation: z.union([z.boolean(),z.lazy(() => ImplementationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  pages: z.union([z.boolean(),z.lazy(() => PageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PRDCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PRDArgsSchema: z.object({
  select: z.lazy(() => PRDSelectSchema).optional(),
  include: z.lazy(() => PRDIncludeSchema).optional(),
}).strict();

export const PRDCountOutputTypeArgsSchema: z.object({
  select: z.lazy(() => PRDCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PRDCountOutputTypeSelectSchema: z.ZodType<Prisma.PRDCountOutputTypeSelect> = z.object({
  pages: z.boolean().optional(),
}).strict();

export const PRDSelectSchema: z.ZodType<Prisma.PRDSelect> = z.object({
  id: z.boolean().optional(),
  appName: z.boolean().optional(),
  appDescription: z.boolean().optional(),
  progLanguage: z.boolean().optional(),
  framework: z.boolean().optional(),
  styling: z.boolean().optional(),
  backend: z.boolean().optional(),
  auth: z.boolean().optional(),
  payments: z.boolean().optional(),
  otherPackages: z.boolean().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  implementation: z.union([z.boolean(),z.lazy(() => ImplementationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  pages: z.union([z.boolean(),z.lazy(() => PageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PRDCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PAGE
//------------------------------------------------------

export const PageIncludeSchema: z.ZodType<Prisma.PageInclude> = z.object({
  prd: z.union([z.boolean(),z.lazy(() => PRDArgsSchema)]).optional(),
}).strict()

export const PageArgsSchema: z.object({
  select: z.lazy(() => PageSelectSchema).optional(),
  include: z.lazy(() => PageIncludeSchema).optional(),
}).strict();

export const PageSelectSchema: z.ZodType<Prisma.PageSelect> = z.object({
  id: z.boolean().optional(),
  pageName: z.boolean().optional(),
  pageDescription: z.boolean().optional(),
  orderIndex: z.boolean().optional(),
  status: z.boolean().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  lastProcessed: z.boolean().optional(),
  prdId: z.boolean().optional(),
  prd: z.union([z.boolean(),z.lazy(() => PRDArgsSchema)]).optional(),
}).strict()

// IMPLEMENTATION
//------------------------------------------------------

export const ImplementationIncludeSchema: z.ZodType<Prisma.ImplementationInclude> = z.object({
  prd: z.union([z.boolean(),z.lazy(() => PRDArgsSchema)]).optional(),
}).strict()

export const ImplementationArgsSchema: z.object({
  select: z.lazy(() => ImplementationSelectSchema).optional(),
  include: z.lazy(() => ImplementationIncludeSchema).optional(),
}).strict();

export const ImplementationSelectSchema: z.ZodType<Prisma.ImplementationSelect> = z.object({
  id: z.boolean().optional(),
  setupSteps: z.boolean().optional(),
  fileStructure: z.boolean().optional(),
  dependencies: z.boolean().optional(),
  deploymentGuide: z.boolean().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  lastProcessed: z.boolean().optional(),
  prdId: z.boolean().optional(),
  prd: z.union([z.boolean(),z.lazy(() => PRDArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  prds: z.lazy(() => PRDListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  prds: z.lazy(() => PRDOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    clerkId: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    clerkId: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    clerkId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  clerkId: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  prds: z.lazy(() => PRDListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PRDWhereInputSchema: z.ZodType<Prisma.PRDWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PRDWhereInputSchema),z.lazy(() => PRDWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PRDWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PRDWhereInputSchema),z.lazy(() => PRDWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  appName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  appDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  progLanguage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  framework: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  styling: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  backend: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  auth: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  payments: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  otherPackages: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  implementation: z.union([ z.lazy(() => ImplementationNullableScalarRelationFilterSchema),z.lazy(() => ImplementationWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  pages: z.lazy(() => PageListRelationFilterSchema).optional()
}).strict();

export const PRDOrderByWithRelationInputSchema: z.ZodType<Prisma.PRDOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  appName: z.lazy(() => SortOrderSchema).optional(),
  appDescription: z.lazy(() => SortOrderSchema).optional(),
  progLanguage: z.lazy(() => SortOrderSchema).optional(),
  framework: z.lazy(() => SortOrderSchema).optional(),
  styling: z.lazy(() => SortOrderSchema).optional(),
  backend: z.lazy(() => SortOrderSchema).optional(),
  auth: z.lazy(() => SortOrderSchema).optional(),
  payments: z.lazy(() => SortOrderSchema).optional(),
  otherPackages: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  implementation: z.lazy(() => ImplementationOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  pages: z.lazy(() => PageOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PRDWhereUniqueInputSchema: z.ZodType<Prisma.PRDWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => PRDWhereInputSchema),z.lazy(() => PRDWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PRDWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PRDWhereInputSchema),z.lazy(() => PRDWhereInputSchema).array() ]).optional(),
  appName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  appDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  progLanguage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  framework: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  styling: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  backend: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  auth: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  payments: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  otherPackages: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  implementation: z.union([ z.lazy(() => ImplementationNullableScalarRelationFilterSchema),z.lazy(() => ImplementationWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  pages: z.lazy(() => PageListRelationFilterSchema).optional()
}).strict());

export const PRDOrderByWithAggregationInputSchema: z.ZodType<Prisma.PRDOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  appName: z.lazy(() => SortOrderSchema).optional(),
  appDescription: z.lazy(() => SortOrderSchema).optional(),
  progLanguage: z.lazy(() => SortOrderSchema).optional(),
  framework: z.lazy(() => SortOrderSchema).optional(),
  styling: z.lazy(() => SortOrderSchema).optional(),
  backend: z.lazy(() => SortOrderSchema).optional(),
  auth: z.lazy(() => SortOrderSchema).optional(),
  payments: z.lazy(() => SortOrderSchema).optional(),
  otherPackages: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PRDCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PRDMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PRDMinOrderByAggregateInputSchema).optional()
}).strict();

export const PRDScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PRDScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PRDScalarWhereWithAggregatesInputSchema),z.lazy(() => PRDScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PRDScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PRDScalarWhereWithAggregatesInputSchema),z.lazy(() => PRDScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  appName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  appDescription: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  progLanguage: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  framework: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  styling: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  backend: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  auth: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  payments: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  otherPackages: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PageWhereInputSchema: z.ZodType<Prisma.PageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pageName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pageDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  prdId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prd: z.union([ z.lazy(() => PRDScalarRelationFilterSchema),z.lazy(() => PRDWhereInputSchema) ]).optional(),
}).strict();

export const PageOrderByWithRelationInputSchema: z.ZodType<Prisma.PageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  pageName: z.lazy(() => SortOrderSchema).optional(),
  pageDescription: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional(),
  prd: z.lazy(() => PRDOrderByWithRelationInputSchema).optional()
}).strict();

export const PageWhereUniqueInputSchema: z.ZodType<Prisma.PageWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    prdId_orderIndex: z.lazy(() => PagePrdIdOrderIndexCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    prdId_orderIndex: z.lazy(() => PagePrdIdOrderIndexCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  prdId_orderIndex: z.lazy(() => PagePrdIdOrderIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  pageName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pageDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  prdId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prd: z.union([ z.lazy(() => PRDScalarRelationFilterSchema),z.lazy(() => PRDWhereInputSchema) ]).optional(),
}).strict());

export const PageOrderByWithAggregationInputSchema: z.ZodType<Prisma.PageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  pageName: z.lazy(() => SortOrderSchema).optional(),
  pageDescription: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PageCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PageAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PageMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PageSumOrderByAggregateInputSchema).optional()
}).strict();

export const PageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PageScalarWhereWithAggregatesInputSchema),z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageScalarWhereWithAggregatesInputSchema),z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  pageName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  pageDescription: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  prdId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ImplementationWhereInputSchema: z.ZodType<Prisma.ImplementationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ImplementationWhereInputSchema),z.lazy(() => ImplementationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ImplementationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ImplementationWhereInputSchema),z.lazy(() => ImplementationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  setupSteps: z.lazy(() => JsonFilterSchema).optional(),
  fileStructure: z.lazy(() => JsonFilterSchema).optional(),
  dependencies: z.lazy(() => JsonFilterSchema).optional(),
  deploymentGuide: z.lazy(() => JsonFilterSchema).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  prdId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  prd: z.union([ z.lazy(() => PRDScalarRelationFilterSchema),z.lazy(() => PRDWhereInputSchema) ]).optional(),
}).strict();

export const ImplementationOrderByWithRelationInputSchema: z.ZodType<Prisma.ImplementationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  setupSteps: z.lazy(() => SortOrderSchema).optional(),
  fileStructure: z.lazy(() => SortOrderSchema).optional(),
  dependencies: z.lazy(() => SortOrderSchema).optional(),
  deploymentGuide: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional(),
  prd: z.lazy(() => PRDOrderByWithRelationInputSchema).optional()
}).strict();

export const ImplementationWhereUniqueInputSchema: z.ZodType<Prisma.ImplementationWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    prdId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    prdId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  prdId: z.string().optional(),
  AND: z.union([ z.lazy(() => ImplementationWhereInputSchema),z.lazy(() => ImplementationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ImplementationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ImplementationWhereInputSchema),z.lazy(() => ImplementationWhereInputSchema).array() ]).optional(),
  setupSteps: z.lazy(() => JsonFilterSchema).optional(),
  fileStructure: z.lazy(() => JsonFilterSchema).optional(),
  dependencies: z.lazy(() => JsonFilterSchema).optional(),
  deploymentGuide: z.lazy(() => JsonFilterSchema).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  prd: z.union([ z.lazy(() => PRDScalarRelationFilterSchema),z.lazy(() => PRDWhereInputSchema) ]).optional(),
}).strict());

export const ImplementationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ImplementationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  setupSteps: z.lazy(() => SortOrderSchema).optional(),
  fileStructure: z.lazy(() => SortOrderSchema).optional(),
  dependencies: z.lazy(() => SortOrderSchema).optional(),
  deploymentGuide: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ImplementationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ImplementationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ImplementationMinOrderByAggregateInputSchema).optional()
}).strict();

export const ImplementationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ImplementationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ImplementationScalarWhereWithAggregatesInputSchema),z.lazy(() => ImplementationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ImplementationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ImplementationScalarWhereWithAggregatesInputSchema),z.lazy(() => ImplementationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  setupSteps: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  fileStructure: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  dependencies: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  deploymentGuide: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  prdId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  clerkId: z.string(),
  email: z.string(),
  name: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  prds: z.lazy(() => PRDCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  clerkId: z.string(),
  email: z.string(),
  name: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  prds: z.lazy(() => PRDUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  prds: z.lazy(() => PRDUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  prds: z.lazy(() => PRDUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  clerkId: z.string(),
  email: z.string(),
  name: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PRDCreateInputSchema: z.ZodType<Prisma.PRDCreateInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  implementation: z.lazy(() => ImplementationCreateNestedOneWithoutPrdInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPrdsInputSchema),
  pages: z.lazy(() => PageCreateNestedManyWithoutPrdInputSchema).optional()
}).strict();

export const PRDUncheckedCreateInputSchema: z.ZodType<Prisma.PRDUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  implementation: z.lazy(() => ImplementationUncheckedCreateNestedOneWithoutPrdInputSchema).optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutPrdInputSchema).optional()
}).strict();

export const PRDUpdateInputSchema: z.ZodType<Prisma.PRDUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  implementation: z.lazy(() => ImplementationUpdateOneWithoutPrdNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPrdsNestedInputSchema).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDUncheckedUpdateInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  implementation: z.lazy(() => ImplementationUncheckedUpdateOneWithoutPrdNestedInputSchema).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDCreateManyInputSchema: z.ZodType<Prisma.PRDCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string()
}).strict();

export const PRDUpdateManyMutationInputSchema: z.ZodType<Prisma.PRDUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PRDUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageCreateInputSchema: z.ZodType<Prisma.PageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable(),
  prd: z.lazy(() => PRDCreateNestedOneWithoutPagesInputSchema)
}).strict();

export const PageUncheckedCreateInputSchema: z.ZodType<Prisma.PageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable(),
  prdId: z.string()
}).strict();

export const PageUpdateInputSchema: z.ZodType<Prisma.PageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prd: z.lazy(() => PRDUpdateOneRequiredWithoutPagesNestedInputSchema).optional()
}).strict();

export const PageUncheckedUpdateInputSchema: z.ZodType<Prisma.PageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prdId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageCreateManyInputSchema: z.ZodType<Prisma.PageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable(),
  prdId: z.string()
}).strict();

export const PageUpdateManyMutationInputSchema: z.ZodType<Prisma.PageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prdId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ImplementationCreateInputSchema: z.ZodType<Prisma.ImplementationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable(),
  prd: z.lazy(() => PRDCreateNestedOneWithoutImplementationInputSchema)
}).strict();

export const ImplementationUncheckedCreateInputSchema: z.ZodType<Prisma.ImplementationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable(),
  prdId: z.string()
}).strict();

export const ImplementationUpdateInputSchema: z.ZodType<Prisma.ImplementationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prd: z.lazy(() => PRDUpdateOneRequiredWithoutImplementationNestedInputSchema).optional()
}).strict();

export const ImplementationUncheckedUpdateInputSchema: z.ZodType<Prisma.ImplementationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prdId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ImplementationCreateManyInputSchema: z.ZodType<Prisma.ImplementationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable(),
  prdId: z.string()
}).strict();

export const ImplementationUpdateManyMutationInputSchema: z.ZodType<Prisma.ImplementationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ImplementationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ImplementationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prdId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const PRDListRelationFilterSchema: z.ZodType<Prisma.PRDListRelationFilter> = z.object({
  every: z.lazy(() => PRDWhereInputSchema).optional(),
  some: z.lazy(() => PRDWhereInputSchema).optional(),
  none: z.lazy(() => PRDWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const PRDOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PRDOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ImplementationNullableScalarRelationFilterSchema: z.ZodType<Prisma.ImplementationNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ImplementationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ImplementationWhereInputSchema).optional().nullable()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const PageListRelationFilterSchema: z.ZodType<Prisma.PageListRelationFilter> = z.object({
  every: z.lazy(() => PageWhereInputSchema).optional(),
  some: z.lazy(() => PageWhereInputSchema).optional(),
  none: z.lazy(() => PageWhereInputSchema).optional()
}).strict();

export const PageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PRDCountOrderByAggregateInputSchema: z.ZodType<Prisma.PRDCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  appName: z.lazy(() => SortOrderSchema).optional(),
  appDescription: z.lazy(() => SortOrderSchema).optional(),
  progLanguage: z.lazy(() => SortOrderSchema).optional(),
  framework: z.lazy(() => SortOrderSchema).optional(),
  styling: z.lazy(() => SortOrderSchema).optional(),
  backend: z.lazy(() => SortOrderSchema).optional(),
  auth: z.lazy(() => SortOrderSchema).optional(),
  payments: z.lazy(() => SortOrderSchema).optional(),
  otherPackages: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PRDMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PRDMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  appName: z.lazy(() => SortOrderSchema).optional(),
  appDescription: z.lazy(() => SortOrderSchema).optional(),
  progLanguage: z.lazy(() => SortOrderSchema).optional(),
  framework: z.lazy(() => SortOrderSchema).optional(),
  styling: z.lazy(() => SortOrderSchema).optional(),
  backend: z.lazy(() => SortOrderSchema).optional(),
  auth: z.lazy(() => SortOrderSchema).optional(),
  payments: z.lazy(() => SortOrderSchema).optional(),
  otherPackages: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PRDMinOrderByAggregateInputSchema: z.ZodType<Prisma.PRDMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  appName: z.lazy(() => SortOrderSchema).optional(),
  appDescription: z.lazy(() => SortOrderSchema).optional(),
  progLanguage: z.lazy(() => SortOrderSchema).optional(),
  framework: z.lazy(() => SortOrderSchema).optional(),
  styling: z.lazy(() => SortOrderSchema).optional(),
  backend: z.lazy(() => SortOrderSchema).optional(),
  auth: z.lazy(() => SortOrderSchema).optional(),
  payments: z.lazy(() => SortOrderSchema).optional(),
  otherPackages: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const PRDScalarRelationFilterSchema: z.ZodType<Prisma.PRDScalarRelationFilter> = z.object({
  is: z.lazy(() => PRDWhereInputSchema).optional(),
  isNot: z.lazy(() => PRDWhereInputSchema).optional()
}).strict();

export const PagePrdIdOrderIndexCompoundUniqueInputSchema: z.ZodType<Prisma.PagePrdIdOrderIndexCompoundUniqueInput> = z.object({
  prdId: z.string(),
  orderIndex: z.number()
}).strict();

export const PageCountOrderByAggregateInputSchema: z.ZodType<Prisma.PageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  pageName: z.lazy(() => SortOrderSchema).optional(),
  pageDescription: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.lazy(() => SortOrderSchema).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PageAvgOrderByAggregateInput> = z.object({
  orderIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  pageName: z.lazy(() => SortOrderSchema).optional(),
  pageDescription: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.lazy(() => SortOrderSchema).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageMinOrderByAggregateInputSchema: z.ZodType<Prisma.PageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  pageName: z.lazy(() => SortOrderSchema).optional(),
  pageDescription: z.lazy(() => SortOrderSchema).optional(),
  orderIndex: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.lazy(() => SortOrderSchema).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageSumOrderByAggregateInputSchema: z.ZodType<Prisma.PageSumOrderByAggregateInput> = z.object({
  orderIndex: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ImplementationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ImplementationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  setupSteps: z.lazy(() => SortOrderSchema).optional(),
  fileStructure: z.lazy(() => SortOrderSchema).optional(),
  dependencies: z.lazy(() => SortOrderSchema).optional(),
  deploymentGuide: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  llmResponse: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.lazy(() => SortOrderSchema).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ImplementationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ImplementationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.lazy(() => SortOrderSchema).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ImplementationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ImplementationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  llmProcessed: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lastProcessed: z.lazy(() => SortOrderSchema).optional(),
  prdId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const PRDCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PRDCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutUserInputSchema),z.lazy(() => PRDCreateWithoutUserInputSchema).array(),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema),z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PRDCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PRDUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PRDUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutUserInputSchema),z.lazy(() => PRDCreateWithoutUserInputSchema).array(),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema),z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PRDCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const PRDUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PRDUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutUserInputSchema),z.lazy(() => PRDCreateWithoutUserInputSchema).array(),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema),z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PRDUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PRDUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PRDCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PRDUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PRDUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PRDUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PRDUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PRDScalarWhereInputSchema),z.lazy(() => PRDScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PRDUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutUserInputSchema),z.lazy(() => PRDCreateWithoutUserInputSchema).array(),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema),z.lazy(() => PRDCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PRDUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PRDUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PRDCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PRDWhereUniqueInputSchema),z.lazy(() => PRDWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PRDUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PRDUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PRDUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PRDUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PRDScalarWhereInputSchema),z.lazy(() => PRDScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ImplementationCreateNestedOneWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationCreateNestedOneWithoutPrdInput> = z.object({
  create: z.union([ z.lazy(() => ImplementationCreateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedCreateWithoutPrdInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ImplementationCreateOrConnectWithoutPrdInputSchema).optional(),
  connect: z.lazy(() => ImplementationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutPrdsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPrdsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPrdsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPrdsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const PageCreateNestedManyWithoutPrdInputSchema: z.ZodType<Prisma.PageCreateNestedManyWithoutPrdInput> = z.object({
  create: z.union([ z.lazy(() => PageCreateWithoutPrdInputSchema),z.lazy(() => PageCreateWithoutPrdInputSchema).array(),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema),z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyPrdInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ImplementationUncheckedCreateNestedOneWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationUncheckedCreateNestedOneWithoutPrdInput> = z.object({
  create: z.union([ z.lazy(() => ImplementationCreateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedCreateWithoutPrdInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ImplementationCreateOrConnectWithoutPrdInputSchema).optional(),
  connect: z.lazy(() => ImplementationWhereUniqueInputSchema).optional()
}).strict();

export const PageUncheckedCreateNestedManyWithoutPrdInputSchema: z.ZodType<Prisma.PageUncheckedCreateNestedManyWithoutPrdInput> = z.object({
  create: z.union([ z.lazy(() => PageCreateWithoutPrdInputSchema),z.lazy(() => PageCreateWithoutPrdInputSchema).array(),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema),z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyPrdInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const ImplementationUpdateOneWithoutPrdNestedInputSchema: z.ZodType<Prisma.ImplementationUpdateOneWithoutPrdNestedInput> = z.object({
  create: z.union([ z.lazy(() => ImplementationCreateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedCreateWithoutPrdInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ImplementationCreateOrConnectWithoutPrdInputSchema).optional(),
  upsert: z.lazy(() => ImplementationUpsertWithoutPrdInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ImplementationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ImplementationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ImplementationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ImplementationUpdateToOneWithWhereWithoutPrdInputSchema),z.lazy(() => ImplementationUpdateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedUpdateWithoutPrdInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPrdsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPrdsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPrdsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPrdsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPrdsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPrdsInputSchema),z.lazy(() => UserUpdateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPrdsInputSchema) ]).optional(),
}).strict();

export const PageUpdateManyWithoutPrdNestedInputSchema: z.ZodType<Prisma.PageUpdateManyWithoutPrdNestedInput> = z.object({
  create: z.union([ z.lazy(() => PageCreateWithoutPrdInputSchema),z.lazy(() => PageCreateWithoutPrdInputSchema).array(),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema),z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PageUpsertWithWhereUniqueWithoutPrdInputSchema),z.lazy(() => PageUpsertWithWhereUniqueWithoutPrdInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyPrdInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PageUpdateWithWhereUniqueWithoutPrdInputSchema),z.lazy(() => PageUpdateWithWhereUniqueWithoutPrdInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PageUpdateManyWithWhereWithoutPrdInputSchema),z.lazy(() => PageUpdateManyWithWhereWithoutPrdInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PageScalarWhereInputSchema),z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ImplementationUncheckedUpdateOneWithoutPrdNestedInputSchema: z.ZodType<Prisma.ImplementationUncheckedUpdateOneWithoutPrdNestedInput> = z.object({
  create: z.union([ z.lazy(() => ImplementationCreateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedCreateWithoutPrdInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ImplementationCreateOrConnectWithoutPrdInputSchema).optional(),
  upsert: z.lazy(() => ImplementationUpsertWithoutPrdInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ImplementationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ImplementationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ImplementationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ImplementationUpdateToOneWithWhereWithoutPrdInputSchema),z.lazy(() => ImplementationUpdateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedUpdateWithoutPrdInputSchema) ]).optional(),
}).strict();

export const PageUncheckedUpdateManyWithoutPrdNestedInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyWithoutPrdNestedInput> = z.object({
  create: z.union([ z.lazy(() => PageCreateWithoutPrdInputSchema),z.lazy(() => PageCreateWithoutPrdInputSchema).array(),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema),z.lazy(() => PageCreateOrConnectWithoutPrdInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PageUpsertWithWhereUniqueWithoutPrdInputSchema),z.lazy(() => PageUpsertWithWhereUniqueWithoutPrdInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyPrdInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema),z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PageUpdateWithWhereUniqueWithoutPrdInputSchema),z.lazy(() => PageUpdateWithWhereUniqueWithoutPrdInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PageUpdateManyWithWhereWithoutPrdInputSchema),z.lazy(() => PageUpdateManyWithWhereWithoutPrdInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PageScalarWhereInputSchema),z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PRDCreateNestedOneWithoutPagesInputSchema: z.ZodType<Prisma.PRDCreateNestedOneWithoutPagesInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedCreateWithoutPagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PRDCreateOrConnectWithoutPagesInputSchema).optional(),
  connect: z.lazy(() => PRDWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const PRDUpdateOneRequiredWithoutPagesNestedInputSchema: z.ZodType<Prisma.PRDUpdateOneRequiredWithoutPagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedCreateWithoutPagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PRDCreateOrConnectWithoutPagesInputSchema).optional(),
  upsert: z.lazy(() => PRDUpsertWithoutPagesInputSchema).optional(),
  connect: z.lazy(() => PRDWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PRDUpdateToOneWithWhereWithoutPagesInputSchema),z.lazy(() => PRDUpdateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutPagesInputSchema) ]).optional(),
}).strict();

export const PRDCreateNestedOneWithoutImplementationInputSchema: z.ZodType<Prisma.PRDCreateNestedOneWithoutImplementationInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedCreateWithoutImplementationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PRDCreateOrConnectWithoutImplementationInputSchema).optional(),
  connect: z.lazy(() => PRDWhereUniqueInputSchema).optional()
}).strict();

export const PRDUpdateOneRequiredWithoutImplementationNestedInputSchema: z.ZodType<Prisma.PRDUpdateOneRequiredWithoutImplementationNestedInput> = z.object({
  create: z.union([ z.lazy(() => PRDCreateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedCreateWithoutImplementationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PRDCreateOrConnectWithoutImplementationInputSchema).optional(),
  upsert: z.lazy(() => PRDUpsertWithoutImplementationInputSchema).optional(),
  connect: z.lazy(() => PRDWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PRDUpdateToOneWithWhereWithoutImplementationInputSchema),z.lazy(() => PRDUpdateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutImplementationInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const PRDCreateWithoutUserInputSchema: z.ZodType<Prisma.PRDCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  implementation: z.lazy(() => ImplementationCreateNestedOneWithoutPrdInputSchema).optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutPrdInputSchema).optional()
}).strict();

export const PRDUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PRDUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  implementation: z.lazy(() => ImplementationUncheckedCreateNestedOneWithoutPrdInputSchema).optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutPrdInputSchema).optional()
}).strict();

export const PRDCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PRDCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PRDWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PRDCreateWithoutUserInputSchema),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PRDCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PRDCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PRDCreateManyUserInputSchema),z.lazy(() => PRDCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PRDUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PRDUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PRDWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PRDUpdateWithoutUserInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PRDCreateWithoutUserInputSchema),z.lazy(() => PRDUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PRDUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PRDUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PRDWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PRDUpdateWithoutUserInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PRDUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PRDUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PRDScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PRDUpdateManyMutationInputSchema),z.lazy(() => PRDUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const PRDScalarWhereInputSchema: z.ZodType<Prisma.PRDScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PRDScalarWhereInputSchema),z.lazy(() => PRDScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PRDScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PRDScalarWhereInputSchema),z.lazy(() => PRDScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  appName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  appDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  progLanguage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  framework: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  styling: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  backend: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  auth: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  payments: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  otherPackages: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ImplementationCreateWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationCreateWithoutPrdInput> = z.object({
  id: z.string().cuid().optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable()
}).strict();

export const ImplementationUncheckedCreateWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationUncheckedCreateWithoutPrdInput> = z.object({
  id: z.string().cuid().optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable()
}).strict();

export const ImplementationCreateOrConnectWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationCreateOrConnectWithoutPrdInput> = z.object({
  where: z.lazy(() => ImplementationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ImplementationCreateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedCreateWithoutPrdInputSchema) ]),
}).strict();

export const UserCreateWithoutPrdsInputSchema: z.ZodType<Prisma.UserCreateWithoutPrdsInput> = z.object({
  id: z.string().cuid().optional(),
  clerkId: z.string(),
  email: z.string(),
  name: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUncheckedCreateWithoutPrdsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPrdsInput> = z.object({
  id: z.string().cuid().optional(),
  clerkId: z.string(),
  email: z.string(),
  name: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserCreateOrConnectWithoutPrdsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPrdsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPrdsInputSchema) ]),
}).strict();

export const PageCreateWithoutPrdInputSchema: z.ZodType<Prisma.PageCreateWithoutPrdInput> = z.object({
  id: z.string().cuid().optional(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable()
}).strict();

export const PageUncheckedCreateWithoutPrdInputSchema: z.ZodType<Prisma.PageUncheckedCreateWithoutPrdInput> = z.object({
  id: z.string().cuid().optional(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable()
}).strict();

export const PageCreateOrConnectWithoutPrdInputSchema: z.ZodType<Prisma.PageCreateOrConnectWithoutPrdInput> = z.object({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PageCreateWithoutPrdInputSchema),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema) ]),
}).strict();

export const PageCreateManyPrdInputEnvelopeSchema: z.ZodType<Prisma.PageCreateManyPrdInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PageCreateManyPrdInputSchema),z.lazy(() => PageCreateManyPrdInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ImplementationUpsertWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationUpsertWithoutPrdInput> = z.object({
  update: z.union([ z.lazy(() => ImplementationUpdateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedUpdateWithoutPrdInputSchema) ]),
  create: z.union([ z.lazy(() => ImplementationCreateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedCreateWithoutPrdInputSchema) ]),
  where: z.lazy(() => ImplementationWhereInputSchema).optional()
}).strict();

export const ImplementationUpdateToOneWithWhereWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationUpdateToOneWithWhereWithoutPrdInput> = z.object({
  where: z.lazy(() => ImplementationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ImplementationUpdateWithoutPrdInputSchema),z.lazy(() => ImplementationUncheckedUpdateWithoutPrdInputSchema) ]),
}).strict();

export const ImplementationUpdateWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationUpdateWithoutPrdInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ImplementationUncheckedUpdateWithoutPrdInputSchema: z.ZodType<Prisma.ImplementationUncheckedUpdateWithoutPrdInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setupSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  fileStructure: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  dependencies: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  deploymentGuide: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUpsertWithoutPrdsInputSchema: z.ZodType<Prisma.UserUpsertWithoutPrdsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPrdsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPrdsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPrdsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPrdsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPrdsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPrdsInputSchema) ]),
}).strict();

export const UserUpdateWithoutPrdsInputSchema: z.ZodType<Prisma.UserUpdateWithoutPrdsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateWithoutPrdsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPrdsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageUpsertWithWhereUniqueWithoutPrdInputSchema: z.ZodType<Prisma.PageUpsertWithWhereUniqueWithoutPrdInput> = z.object({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PageUpdateWithoutPrdInputSchema),z.lazy(() => PageUncheckedUpdateWithoutPrdInputSchema) ]),
  create: z.union([ z.lazy(() => PageCreateWithoutPrdInputSchema),z.lazy(() => PageUncheckedCreateWithoutPrdInputSchema) ]),
}).strict();

export const PageUpdateWithWhereUniqueWithoutPrdInputSchema: z.ZodType<Prisma.PageUpdateWithWhereUniqueWithoutPrdInput> = z.object({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PageUpdateWithoutPrdInputSchema),z.lazy(() => PageUncheckedUpdateWithoutPrdInputSchema) ]),
}).strict();

export const PageUpdateManyWithWhereWithoutPrdInputSchema: z.ZodType<Prisma.PageUpdateManyWithWhereWithoutPrdInput> = z.object({
  where: z.lazy(() => PageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PageUpdateManyMutationInputSchema),z.lazy(() => PageUncheckedUpdateManyWithoutPrdInputSchema) ]),
}).strict();

export const PageScalarWhereInputSchema: z.ZodType<Prisma.PageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PageScalarWhereInputSchema),z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageScalarWhereInputSchema),z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pageName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pageDescription: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orderIndex: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  llmProcessed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  llmResponse: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lastProcessed: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  prdId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const PRDCreateWithoutPagesInputSchema: z.ZodType<Prisma.PRDCreateWithoutPagesInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  implementation: z.lazy(() => ImplementationCreateNestedOneWithoutPrdInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPrdsInputSchema)
}).strict();

export const PRDUncheckedCreateWithoutPagesInputSchema: z.ZodType<Prisma.PRDUncheckedCreateWithoutPagesInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  implementation: z.lazy(() => ImplementationUncheckedCreateNestedOneWithoutPrdInputSchema).optional()
}).strict();

export const PRDCreateOrConnectWithoutPagesInputSchema: z.ZodType<Prisma.PRDCreateOrConnectWithoutPagesInput> = z.object({
  where: z.lazy(() => PRDWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PRDCreateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedCreateWithoutPagesInputSchema) ]),
}).strict();

export const PRDUpsertWithoutPagesInputSchema: z.ZodType<Prisma.PRDUpsertWithoutPagesInput> = z.object({
  update: z.union([ z.lazy(() => PRDUpdateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutPagesInputSchema) ]),
  create: z.union([ z.lazy(() => PRDCreateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedCreateWithoutPagesInputSchema) ]),
  where: z.lazy(() => PRDWhereInputSchema).optional()
}).strict();

export const PRDUpdateToOneWithWhereWithoutPagesInputSchema: z.ZodType<Prisma.PRDUpdateToOneWithWhereWithoutPagesInput> = z.object({
  where: z.lazy(() => PRDWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PRDUpdateWithoutPagesInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutPagesInputSchema) ]),
}).strict();

export const PRDUpdateWithoutPagesInputSchema: z.ZodType<Prisma.PRDUpdateWithoutPagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  implementation: z.lazy(() => ImplementationUpdateOneWithoutPrdNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPrdsNestedInputSchema).optional()
}).strict();

export const PRDUncheckedUpdateWithoutPagesInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateWithoutPagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  implementation: z.lazy(() => ImplementationUncheckedUpdateOneWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDCreateWithoutImplementationInputSchema: z.ZodType<Prisma.PRDCreateWithoutImplementationInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutPrdsInputSchema),
  pages: z.lazy(() => PageCreateNestedManyWithoutPrdInputSchema).optional()
}).strict();

export const PRDUncheckedCreateWithoutImplementationInputSchema: z.ZodType<Prisma.PRDUncheckedCreateWithoutImplementationInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutPrdInputSchema).optional()
}).strict();

export const PRDCreateOrConnectWithoutImplementationInputSchema: z.ZodType<Prisma.PRDCreateOrConnectWithoutImplementationInput> = z.object({
  where: z.lazy(() => PRDWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PRDCreateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedCreateWithoutImplementationInputSchema) ]),
}).strict();

export const PRDUpsertWithoutImplementationInputSchema: z.ZodType<Prisma.PRDUpsertWithoutImplementationInput> = z.object({
  update: z.union([ z.lazy(() => PRDUpdateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutImplementationInputSchema) ]),
  create: z.union([ z.lazy(() => PRDCreateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedCreateWithoutImplementationInputSchema) ]),
  where: z.lazy(() => PRDWhereInputSchema).optional()
}).strict();

export const PRDUpdateToOneWithWhereWithoutImplementationInputSchema: z.ZodType<Prisma.PRDUpdateToOneWithWhereWithoutImplementationInput> = z.object({
  where: z.lazy(() => PRDWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PRDUpdateWithoutImplementationInputSchema),z.lazy(() => PRDUncheckedUpdateWithoutImplementationInputSchema) ]),
}).strict();

export const PRDUpdateWithoutImplementationInputSchema: z.ZodType<Prisma.PRDUpdateWithoutImplementationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPrdsNestedInputSchema).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDUncheckedUpdateWithoutImplementationInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateWithoutImplementationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDCreateManyUserInputSchema: z.ZodType<Prisma.PRDCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  appName: z.string(),
  appDescription: z.string(),
  progLanguage: z.string(),
  framework: z.string(),
  styling: z.string(),
  backend: z.string(),
  auth: z.string(),
  payments: z.string(),
  otherPackages: z.string(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PRDUpdateWithoutUserInputSchema: z.ZodType<Prisma.PRDUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  implementation: z.lazy(() => ImplementationUpdateOneWithoutPrdNestedInputSchema).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  implementation: z.lazy(() => ImplementationUncheckedUpdateOneWithoutPrdNestedInputSchema).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutPrdNestedInputSchema).optional()
}).strict();

export const PRDUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PRDUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  appDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  progLanguage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  framework: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  styling: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  backend: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auth: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  otherPackages: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageCreateManyPrdInputSchema: z.ZodType<Prisma.PageCreateManyPrdInput> = z.object({
  id: z.string().cuid().optional(),
  pageName: z.string(),
  pageDescription: z.string(),
  orderIndex: z.number().int(),
  status: z.string().optional(),
  llmProcessed: z.boolean().optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastProcessed: z.coerce.date().optional().nullable()
}).strict();

export const PageUpdateWithoutPrdInputSchema: z.ZodType<Prisma.PageUpdateWithoutPrdInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageUncheckedUpdateWithoutPrdInputSchema: z.ZodType<Prisma.PageUncheckedUpdateWithoutPrdInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageUncheckedUpdateManyWithoutPrdInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyWithoutPrdInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageDescription: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  llmProcessed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  llmResponse: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lastProcessed: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const PRDFindFirstArgsSchema: z.ZodType<Prisma.PRDFindFirstArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereInputSchema.optional(),
  orderBy: z.union([ PRDOrderByWithRelationInputSchema.array(),PRDOrderByWithRelationInputSchema ]).optional(),
  cursor: PRDWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PRDScalarFieldEnumSchema,PRDScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PRDFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PRDFindFirstOrThrowArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereInputSchema.optional(),
  orderBy: z.union([ PRDOrderByWithRelationInputSchema.array(),PRDOrderByWithRelationInputSchema ]).optional(),
  cursor: PRDWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PRDScalarFieldEnumSchema,PRDScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PRDFindManyArgsSchema: z.ZodType<Prisma.PRDFindManyArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereInputSchema.optional(),
  orderBy: z.union([ PRDOrderByWithRelationInputSchema.array(),PRDOrderByWithRelationInputSchema ]).optional(),
  cursor: PRDWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PRDScalarFieldEnumSchema,PRDScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PRDAggregateArgsSchema: z.ZodType<Prisma.PRDAggregateArgs> = z.object({
  where: PRDWhereInputSchema.optional(),
  orderBy: z.union([ PRDOrderByWithRelationInputSchema.array(),PRDOrderByWithRelationInputSchema ]).optional(),
  cursor: PRDWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PRDGroupByArgsSchema: z.ZodType<Prisma.PRDGroupByArgs> = z.object({
  where: PRDWhereInputSchema.optional(),
  orderBy: z.union([ PRDOrderByWithAggregationInputSchema.array(),PRDOrderByWithAggregationInputSchema ]).optional(),
  by: PRDScalarFieldEnumSchema.array(),
  having: PRDScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PRDFindUniqueArgsSchema: z.ZodType<Prisma.PRDFindUniqueArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereUniqueInputSchema,
}).strict() ;

export const PRDFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PRDFindUniqueOrThrowArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereUniqueInputSchema,
}).strict() ;

export const PageFindFirstArgsSchema: z.ZodType<Prisma.PageFindFirstArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema,PageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PageFindFirstOrThrowArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema,PageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageFindManyArgsSchema: z.ZodType<Prisma.PageFindManyArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema,PageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageAggregateArgsSchema: z.ZodType<Prisma.PageAggregateArgs> = z.object({
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PageGroupByArgsSchema: z.ZodType<Prisma.PageGroupByArgs> = z.object({
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithAggregationInputSchema.array(),PageOrderByWithAggregationInputSchema ]).optional(),
  by: PageScalarFieldEnumSchema.array(),
  having: PageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PageFindUniqueArgsSchema: z.ZodType<Prisma.PageFindUniqueArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const PageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PageFindUniqueOrThrowArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const ImplementationFindFirstArgsSchema: z.ZodType<Prisma.ImplementationFindFirstArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereInputSchema.optional(),
  orderBy: z.union([ ImplementationOrderByWithRelationInputSchema.array(),ImplementationOrderByWithRelationInputSchema ]).optional(),
  cursor: ImplementationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ImplementationScalarFieldEnumSchema,ImplementationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ImplementationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ImplementationFindFirstOrThrowArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereInputSchema.optional(),
  orderBy: z.union([ ImplementationOrderByWithRelationInputSchema.array(),ImplementationOrderByWithRelationInputSchema ]).optional(),
  cursor: ImplementationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ImplementationScalarFieldEnumSchema,ImplementationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ImplementationFindManyArgsSchema: z.ZodType<Prisma.ImplementationFindManyArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereInputSchema.optional(),
  orderBy: z.union([ ImplementationOrderByWithRelationInputSchema.array(),ImplementationOrderByWithRelationInputSchema ]).optional(),
  cursor: ImplementationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ImplementationScalarFieldEnumSchema,ImplementationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ImplementationAggregateArgsSchema: z.ZodType<Prisma.ImplementationAggregateArgs> = z.object({
  where: ImplementationWhereInputSchema.optional(),
  orderBy: z.union([ ImplementationOrderByWithRelationInputSchema.array(),ImplementationOrderByWithRelationInputSchema ]).optional(),
  cursor: ImplementationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ImplementationGroupByArgsSchema: z.ZodType<Prisma.ImplementationGroupByArgs> = z.object({
  where: ImplementationWhereInputSchema.optional(),
  orderBy: z.union([ ImplementationOrderByWithAggregationInputSchema.array(),ImplementationOrderByWithAggregationInputSchema ]).optional(),
  by: ImplementationScalarFieldEnumSchema.array(),
  having: ImplementationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ImplementationFindUniqueArgsSchema: z.ZodType<Prisma.ImplementationFindUniqueArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereUniqueInputSchema,
}).strict() ;

export const ImplementationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ImplementationFindUniqueOrThrowArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const PRDCreateArgsSchema: z.ZodType<Prisma.PRDCreateArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  data: z.union([ PRDCreateInputSchema,PRDUncheckedCreateInputSchema ]),
}).strict() ;

export const PRDUpsertArgsSchema: z.ZodType<Prisma.PRDUpsertArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereUniqueInputSchema,
  create: z.union([ PRDCreateInputSchema,PRDUncheckedCreateInputSchema ]),
  update: z.union([ PRDUpdateInputSchema,PRDUncheckedUpdateInputSchema ]),
}).strict() ;

export const PRDCreateManyArgsSchema: z.ZodType<Prisma.PRDCreateManyArgs> = z.object({
  data: z.union([ PRDCreateManyInputSchema,PRDCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PRDCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PRDCreateManyAndReturnArgs> = z.object({
  data: z.union([ PRDCreateManyInputSchema,PRDCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PRDDeleteArgsSchema: z.ZodType<Prisma.PRDDeleteArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  where: PRDWhereUniqueInputSchema,
}).strict() ;

export const PRDUpdateArgsSchema: z.ZodType<Prisma.PRDUpdateArgs> = z.object({
  select: PRDSelectSchema.optional(),
  include: PRDIncludeSchema.optional(),
  data: z.union([ PRDUpdateInputSchema,PRDUncheckedUpdateInputSchema ]),
  where: PRDWhereUniqueInputSchema,
}).strict() ;

export const PRDUpdateManyArgsSchema: z.ZodType<Prisma.PRDUpdateManyArgs> = z.object({
  data: z.union([ PRDUpdateManyMutationInputSchema,PRDUncheckedUpdateManyInputSchema ]),
  where: PRDWhereInputSchema.optional(),
}).strict() ;

export const PRDDeleteManyArgsSchema: z.ZodType<Prisma.PRDDeleteManyArgs> = z.object({
  where: PRDWhereInputSchema.optional(),
}).strict() ;

export const PageCreateArgsSchema: z.ZodType<Prisma.PageCreateArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  data: z.union([ PageCreateInputSchema,PageUncheckedCreateInputSchema ]),
}).strict() ;

export const PageUpsertArgsSchema: z.ZodType<Prisma.PageUpsertArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema,
  create: z.union([ PageCreateInputSchema,PageUncheckedCreateInputSchema ]),
  update: z.union([ PageUpdateInputSchema,PageUncheckedUpdateInputSchema ]),
}).strict() ;

export const PageCreateManyArgsSchema: z.ZodType<Prisma.PageCreateManyArgs> = z.object({
  data: z.union([ PageCreateManyInputSchema,PageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PageCreateManyAndReturnArgs> = z.object({
  data: z.union([ PageCreateManyInputSchema,PageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PageDeleteArgsSchema: z.ZodType<Prisma.PageDeleteArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const PageUpdateArgsSchema: z.ZodType<Prisma.PageUpdateArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  data: z.union([ PageUpdateInputSchema,PageUncheckedUpdateInputSchema ]),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const PageUpdateManyArgsSchema: z.ZodType<Prisma.PageUpdateManyArgs> = z.object({
  data: z.union([ PageUpdateManyMutationInputSchema,PageUncheckedUpdateManyInputSchema ]),
  where: PageWhereInputSchema.optional(),
}).strict() ;

export const PageDeleteManyArgsSchema: z.ZodType<Prisma.PageDeleteManyArgs> = z.object({
  where: PageWhereInputSchema.optional(),
}).strict() ;

export const ImplementationCreateArgsSchema: z.ZodType<Prisma.ImplementationCreateArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  data: z.union([ ImplementationCreateInputSchema,ImplementationUncheckedCreateInputSchema ]),
}).strict() ;

export const ImplementationUpsertArgsSchema: z.ZodType<Prisma.ImplementationUpsertArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereUniqueInputSchema,
  create: z.union([ ImplementationCreateInputSchema,ImplementationUncheckedCreateInputSchema ]),
  update: z.union([ ImplementationUpdateInputSchema,ImplementationUncheckedUpdateInputSchema ]),
}).strict() ;

export const ImplementationCreateManyArgsSchema: z.ZodType<Prisma.ImplementationCreateManyArgs> = z.object({
  data: z.union([ ImplementationCreateManyInputSchema,ImplementationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ImplementationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ImplementationCreateManyAndReturnArgs> = z.object({
  data: z.union([ ImplementationCreateManyInputSchema,ImplementationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ImplementationDeleteArgsSchema: z.ZodType<Prisma.ImplementationDeleteArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  where: ImplementationWhereUniqueInputSchema,
}).strict() ;

export const ImplementationUpdateArgsSchema: z.ZodType<Prisma.ImplementationUpdateArgs> = z.object({
  select: ImplementationSelectSchema.optional(),
  include: ImplementationIncludeSchema.optional(),
  data: z.union([ ImplementationUpdateInputSchema,ImplementationUncheckedUpdateInputSchema ]),
  where: ImplementationWhereUniqueInputSchema,
}).strict() ;

export const ImplementationUpdateManyArgsSchema: z.ZodType<Prisma.ImplementationUpdateManyArgs> = z.object({
  data: z.union([ ImplementationUpdateManyMutationInputSchema,ImplementationUncheckedUpdateManyInputSchema ]),
  where: ImplementationWhereInputSchema.optional(),
}).strict() ;

export const ImplementationDeleteManyArgsSchema: z.ZodType<Prisma.ImplementationDeleteManyArgs> = z.object({
  where: ImplementationWhereInputSchema.optional(),
}).strict() ;