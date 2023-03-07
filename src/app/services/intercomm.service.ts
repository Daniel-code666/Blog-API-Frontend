import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntercommService {

  private approvalStageMessage = new BehaviorSubject('false');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  private approvalStageMessage2 = new BehaviorSubject('false')
  currentApprovalStageMessage2 = this.approvalStageMessage2.asObservable();

  constructor() { }

  updateApprovalMessage(message: string) {
    this.approvalStageMessage.next(message)
  }

  updateApprovalMessage2(message: string) {
    this.approvalStageMessage2.next(message)
  }
}
