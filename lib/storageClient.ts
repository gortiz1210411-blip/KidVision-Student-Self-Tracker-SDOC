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
    order: () => mockChain,
    limit: () => mockChain,
    single: () => Promise.resolve({ data: null, error: storageUnavailableError }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (value: { data: any[]; error: null }) => unknown) => resolve({ data: [], error: null }),
  };

  return mockChain;
}

export const dataClient = {
  from: (...args: any[]) => createMockQueryBuilder(),
};

export function isDistrictStorageConfigured(): boolean {
  return false;
}