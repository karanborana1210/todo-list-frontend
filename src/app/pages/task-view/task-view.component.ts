import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  lists: List[];
  tasks: Task[];

  selectedListId: string;

  constructor(private taskService: TaskService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe(
            (tasks: Task[]) => {
              this.tasks = tasks;
            }
          );
        } else {
          this.tasks = undefined;
        }
      }
    );

    this.taskService.getList().subscribe(
      (lists: List[]) => {
        this.lists = lists;
      }
    );
  }

  onTaskClicked(task: Task) {
    this.taskService.coomplete(task).subscribe(
      () => {       
        task.completed = !task.completed;
        console.log(`Marked as ${task.completed}`); 
      }
    );
  }

  onDeleteListClicked() {
    this.taskService.deleteList(this.selectedListId).subscribe(
      (res: any) => {
        this.router.navigate(['/lists']);
        console.log(res);
      }
    )
  }

  onTaskDeleteCLick(taskId: string) {
    this.taskService.deleteTask(this.selectedListId, taskId).subscribe(
      (res: any) => {
        this.tasks = this.tasks.filter(val => val._id !== taskId);
        console.log(res);
      }
    )
  }

}
