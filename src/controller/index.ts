import { NextFunction, Request, Response } from "express";

interface ApiError extends Error {
    message: string;
    line: string;
}

export interface DerivedClassResponse {
    success: boolean;
    message: string;
    statusCode: 200 | 201 | 400 | 401 | 402 | 403 | 404 | 409 | 500 | 501 | 502;
    data: Record<string, any> | null;
    error: ApiError | null;
}

class BaseController {
    constructor(protected req: Request, protected res: Response, protected next: NextFunction) {
        this.req = req;
        this.res = res;
    }

    handleResponse({ statusCode, success, message, data, error }: DerivedClassResponse) {

        this.res.status(statusCode).json({
            success,
            message,
            data,
            error,
        })
    }

    private handleError(err: Error) {
        this.res.status(500).json({
            success: false,
            message: err.stack?.split("\n")?.slice(0, 1)[0],
            data: null,
            error: {
                message: err.message,
                line: err.stack?.split("\n")?.slice(1, 3)?.join(",")?.trim(),
            }
        });
    }


    protected async executeSafely(func: (...args: any[]) => Promise<DerivedClassResponse>) {
        try {
            let result: DerivedClassResponse = await func();
            this.handleResponse(result);
        } catch (err) {
            this.handleError(err);
        }
    }
}

interface ClassInitializer<T> {
    new(req: Request, res: Response, next: NextFunction): T;
}

const initializeClass = <T extends BaseController>(req: Request, res: Response, next: NextFunction, controller: ClassInitializer<T>) => {
    let instance = new controller(req, res, next);
    return instance;
}

export { BaseController, initializeClass };