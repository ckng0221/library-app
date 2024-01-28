import type { NextFunction, Request, Response } from 'express';

const BASEURL_AUTH = process.env.BASEURL_AUTH || 'http://localhost:8005';

//TODO: may move authentication to individual services
/**
 * Require Bearer toekn in the Authorization header
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function authVerification(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization.replace('Bearer ', '');
  // console.log(token);

  try {
    const data = JSON.stringify({ token: token });
    // console.log(data);

    const response = await fetch(`${BASEURL_AUTH}/auth/verification`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    });
    if (response.status !== 200) {
      return res.status(401).send('Unauthorized');
    }
    const tokenDecrypted = await response.json();
    req.headers['user_id'] = tokenDecrypted?.sub;

    next(); //forward request through to proxy middleware
  } catch (err) {
    throw err;
  }
}
