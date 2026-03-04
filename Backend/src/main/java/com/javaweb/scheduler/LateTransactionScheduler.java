package com.javaweb.scheduler;

import com.javaweb.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LateTransactionScheduler {
    private final ITransactionService transactionService;

    @Scheduled(cron = "0 0 0 * * ?", zone = "Asia/Ho_Chi_Minh")
    public void run(){
        log.info("Late-mark job: start");
        transactionService.markOverdueTransactions();
        log.info("Late-mark job: finished");
    }
}
