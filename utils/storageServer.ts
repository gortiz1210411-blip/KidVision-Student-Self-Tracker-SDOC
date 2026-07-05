const storageUnavailableError = {
  message: "District storage connector is not enabled in this review build.",
  code: "NOT_CONFIGURED",
};

function createMockQueryBuilder(): any {
  const mockChain: any = {
    from: () => mockChain,
    select: () => mockChain,
    insert: () => mockChain,
    update: () => mockChain,
    delete: () => mockChain,
    eq: () => mockChain,
    ilike: () => mockChain,
    or: () => mockChain,
    neq: () => mockChain,
    gt: () => mockChain,
    lt: () => mockChain,
    gte: () => mockChain,
    lte: () => mockChain,
    like: () => mockChain,
    is: () => mockChain,
    in: () => mockChain,
    order: () => mockChain,
    limit: () => mockChain,
    single: () => Promise.resolve({ data: null, error: storageUnavailableError }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (value: { data: any[]; error: null }) => unknown) => resolve({ data: [], error: null }),
  };

  return mockChain;
}

function createMockClient(): any {
  return {
    from: (...args: any[]) => createMockQueryBuilder(),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: storageUnavailableError }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}

export function isDistrictStorageConfigured(): boolean {
  return false;
}

export function createStorageServerClient(): any {
  return createMockClient();
}