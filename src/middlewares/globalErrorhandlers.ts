import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

import fs from "fs";
import path from "path";

function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;

    // Log the error to a file for debugging
    try {
        const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.url}\nError: ${err?.message || err}\nStack: ${err?.stack}\n\n`;
        fs.appendFileSync(path.join(process.cwd(), "error.log"), logMsg);
    } catch (logErr) {
        console.error("Failed to write to error.log", logErr);
    }

    // PrismaClientValidationError
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provide incorrect field type or missing fields!"
    }
    // PrismaClientKnownRequestError
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 400;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found."
        }
        else if (err.code === "P2002") {
            statusCode = 400;
            errorMessage = "Duplicate key error"
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed"
        }
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error occurred during query execution"
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Authentication failed. Please check your creditials!"
        }
        else if (err.errorCode === "P1001") {
            statusCode = 400;
            errorMessage = "Can't reach database server"
        }
    }

    res.status(statusCode).json({
        message: errorMessage,
        error: err?.message || "Unknown error" // More stable than the whole object
    })
}

export default errorHandler;