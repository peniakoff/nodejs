/* @flow */
import type {
  Client,
  ClientOptions,
  ClientRequest,
  ClientResponse,
  ClientResult,
  ProcessFn,
  ProcessOptions,
  SuccessResult,
} from 'types/sdk'
import qs from 'querystring'

export default function createClient (options: ClientOptions = {}): Client {
  const {
    middlewares,
  } = options

  if (middlewares && !Array.isArray(middlewares))
    throw new Error('Middlewares should be an array')

  if (!middlewares || !Array.isArray(middlewares) || !middlewares.length)
    throw new Error('You need to provide at least one middleware')

  return {
    /*
      Given a request object,
    */
    execute (request: ClientRequest): Promise<ClientResult> {
      // TODO: validate request shape
      return new Promise((resolve, reject) => {
        const resolver = (rq: ClientRequest, rs: ClientResponse) => {
          // Note: pick the promise `resolve` and `reject` function from
          // the response object. This is not necessary the same function
          // given from the `new Promise` constructor, as middlewares could
          // override those functions for custom behaviours.
          if (rs.error)
            rs.reject(rs.error)
          else
            rs.resolve({
              body: rs.body || {},
              statusCode: rs.statusCode,
            })
        }

        const dispatch = compose(...middlewares)(resolver)
        dispatch(
          request,
          // Initial response shape
          {
            resolve,
            reject,
            body: undefined,
            error: undefined,
          },
        )
      })
    },

    process (
      request: ClientRequest,
      fn: ProcessFn,
      opt: ProcessOptions = { accumulate: true },
    ): Promise<Array<Object>> {
      // Validate arguments
      // - request must be a GET request
      // - fn must be a function

      return new Promise((resolve, reject) => {
        const [path, queryString] = request.uri.split('?')
        const query = {
          // defaults
          limit: 20,
          // merge given query params
          ...qs.parse(queryString),
        }
        const originalQueryString = qs.stringify(query)

        const processPage = (lastId?: string, acc?: Array<any> = []) => {
          const enhancedQuery = {
            sort: 'id asc',
            withTotal: false,
            ...(lastId ? { where: `id > "${lastId}"` } : {}),
          }
          const enhancedQueryString = qs.stringify(enhancedQuery)
          const enhancedRequest = {
            ...request,
            uri: `${path}?${enhancedQueryString}&${originalQueryString}`,
          }

          this.execute(enhancedRequest)
          .then((payload: SuccessResult) => {
            fn(payload)
            .then((result: any) => {
              const resultsLength = payload.body.results.length
              let accumulated
              if (opt.accumulate)
                accumulated = acc.concat(result || [])

              // If we get less results in a page then the limit set it means
              // that there are no more pages and that we can finally resolve
              // the promise.
              if (resultsLength < query.limit) {
                resolve(accumulated || [])
                return
              }

              const last = payload.body.results[resultsLength - 1]
              const newLastId = last && last.id
              processPage(newLastId, accumulated)
            })
          })
          .catch(reject)
        }

        // Start iterating through pages
        processPage()
      })
    },
  }
}


function compose (...funcs: Array<Function>): Function {
  // eslint-disable-next-line no-param-reassign
  funcs = funcs.filter(func => typeof func === 'function')

  if (funcs.length === 1)
    return funcs[0]

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
