import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models';
import { DialogflowService } from '../../services';
import { FormControl } from '@angular/forms';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements OnInit {
  options: string[] = [];  

  // @Input('message')
  public message: Message = new Message(
    '',
    'assets/images/user.png',
    '',
    false
  );

  // @Input('messages')
  public messages: Message[];

  topics: string[] = [
    'Education',
    'Environment',
    'Politics',
    'Healthcare',
    'Technology',
  ];
  public selectedTopic = '';
  selectedTopics : any = {
    'Politics': false, 
    'Healthcare': false,
    'Education': false,
    'Environment': false,
    'Technology': false,
  };


  currContent = '';
  constructor(private dialogFlowService: DialogflowService) {
    this.messages = this.dialogFlowService.getLocalMessages();
  }

  ngOnInit() {}

  chipChange(event : any) {

    this.selectedTopic = (event.value && event.value!=undefined) ? event.value : '';
    // alert((this.selectedTopic ))
    // return (event.value)
  }
  toggleSelection(chip: any) {
    this.selectedTopics[chip.value] = !this.selectedTopics[chip.value];
    console.log(this.selectedTopics);
    chip.toggleSelected();
  }

  getSelectedTopics() {
    let res = '';
    for (let key in this.selectedTopics) {
      if (this.selectedTopics[key]) {
        res = key;
      }
    }
    return res;
  }

  public sendMessage(): void {
    this.messages = this.dialogFlowService.getLocalMessages();
    if (this.currContent && this.currContent.trim() != '') {
      this.message.timestamp = this.dialogFlowService.format24Hour(); //new Date();
      this.message.content = this.currContent;
      this.currContent = '';
      this.messages.push(this.message);
      this.dialogFlowService.updateLocalMessages(this.message);
      // alert('before  :'+ this.getSelectedTopics());
      this.dialogFlowService
        .getResponse(this.message.content, this.selectedTopic)
        .subscribe((res) => {
          // alert(JSON.stringify(res));
          let temp = res as Message;
          temp.timestamp =  this.dialogFlowService.format24Hour();
          // {"content":"Is both an option? If so, I saw both! But I do love beethoven's 5","timestamp":"","avatar":"","isBot":true}
          this.dialogFlowService.updateLocalMessages(res);
        });
    }
  }
}

// topicControl = new FormControl([]);
// topicList: string[] = [
//   'Education',
//   'Environment',
//   'Politics',
//   'Health',
//   'Chit Chat',
// ];

// onTopicRemoved(removedTop: string) {
//   const topics = this.topicControl.value as string[];
//   this.removeFirst(topics, removedTop);
//   this.topicControl.setValue(topics); // To trigger change detection
// }

// private removeFirst<T>(array: T[], toRemove: T): void {
//   const index = array.indexOf(toRemove);
//   if (index !== -1) {
//     array.splice(index, 1);
//   }
// }
