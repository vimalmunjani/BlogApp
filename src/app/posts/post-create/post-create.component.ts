import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
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
  form: FormGroup;
  imagePreview;

  constructor(private snackBar: MatSnackBar,
    private postsService: PostsService,
    private router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [ Validators.required]}),
      content: new FormControl(null, { validators: [ Validators.required ]}),
      image: new FormControl(null, { validators: [ ]})
    });

  }

  onFileSelected(event: Event) {

    console.log('file selected');

    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    this.imagePreview = reader.result;
    };

  }

  onSavePost() {

    if (this.form.invalid) {
      this.snackBar.open('Enter Required Fields', 'OK', {
        duration: 2000,
      });
      return;
    }

    // const newPost1 = {
    //   _id: '',
    //   title: this.form.value.title,
    //   content: this.form.value.content,
    //   image: this.form.value.image
    // };

    const newPost = new FormData();
    newPost.append('title', this.form.value.title);
    newPost.append('content', this.form.value.content);
    newPost.append('image', this.form.value.image, this.form.value.title);

    console.log('new Post' , JSON.stringify(newPost));


    this.isLoading = true;
    this.postsService.addPost(newPost).subscribe((res) => {
      if (res.status === 201) {
        this.postsService.getPosts();
        this.isLoading = false;
        this.router.navigate(['']);
      } else {
        this.isLoading = false;
        this.snackBar.open('Error Adding Post', 'OK', {
          duration: 2000,
        });
        return;
      }
    });

    this.form.reset();
    // this.postCreated.emit(newPost);

  }

}
