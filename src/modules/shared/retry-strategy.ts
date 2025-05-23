import { Logger } from "@nestjs/common";

  export const retryWithBackoff = async (
    fn: () => Promise<any>,
    maxRetries: number,
    maxDelayMs: number,
    delayMs: number,
    attempt = 1,
    logger: Logger
  ): Promise<any> => {
    try {
      return await fn();
    } catch (error) {
      if (attempt > maxRetries) {
        logger.error(`Falha após ${maxRetries} tentativas: ${error.message}`, error.stack);
        throw error;
      }

      // Calcular o próximo delay com jitter (variação aleatória)
      const nextDelay = Math.min(
        delayMs * Math.pow(2, attempt - 1) * (0.5 + Math.random()),
        maxDelayMs
      );

      logger.warn(
        `Tentativa ${attempt} falhou: ${error.message}. Tentando novamente em ${Math.round(nextDelay)}ms...`
      );

      // Esperar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, nextDelay));

      // Tentar novamente com backoff
      return retryWithBackoff(fn, maxRetries, maxDelayMs, delayMs, attempt + 1, logger);
    }
  }