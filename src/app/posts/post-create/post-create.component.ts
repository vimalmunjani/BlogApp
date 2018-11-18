import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // @Output()
  // postCreated = new EventEmitter<Post>();
  isLoading = false;

  constructor(private snackBar: MatSnackBar,
    private postsService: PostsService,
    private router: Router) { }

  ngOnInit() {
  }

  onSavePost(form: NgForm) {

    
    if (form.invalid) {
      this.snackBar.open('Enter Required Fields', 'OK', {
        duration: 2000,
      });
      return;
    }

    const newPost: Post = {
      _id: '',
      title: form.value.postTitle,
      content: form.value.postContent
    };
    
    this.isLoading = true;
    this.postsService.addPost(newPost).subscribe((res) => {
      if (res.status === 201) {
        this.postsService.getPosts();
        this.isLoading = false;
        this.router.navigate(['']);
      } else {
        this.isLoading = false;
        this.snackBar.open('Error adding Post', 'OK', {
          duration: 2000,
        });
        return;
      }
    });

    form.resetForm();
    // this.postCreated.emit(newPost);

  }

}
