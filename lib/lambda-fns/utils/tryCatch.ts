export const tryCatch = (tryer: () => any) => {
  try {
    const result = tryer();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
  
export const asyncTryCatch = async (tryFunction: any) => {
  try {
    const result = await tryFunction;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
  
  /* 
    Note on using asyncTryCatch with Promise.allSettled():
    
    This no longer leverages the expected signature from an
    Error response, so all Promises show as fulfilled, e.g.
  
    const values = await Promise.allSettled([
      asyncTryCatch(Promise.resolve(22)),
      asyncTryCatch(new Promise(resolve => setTimeout(() => resolve(44), 0))),
      asyncTryCatch(66),
      asyncTryCatch(Promise.reject(new Error('an error')))
    ])
  
    values will equal:
  
    [
      {status: "fulfilled", value: [11, null]},
      {status: "fulfilled", value: [33, null]},
      {status: "fulfilled", value: [87, null]},
      {status: "fulfilled",  value: [null, Error: an error]}
    ]
  */