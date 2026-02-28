import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  isEditMode: boolean = false;
  id!: number;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actR: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z ]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: this.getTodayDate(), disabled: true }],
      status: [{ value: 'en_attente', disabled: true }]
    });

    this.id = this.actR.snapshot.params['id'];
    if (this.id) {
  this.isEditMode = true;
  this.suggestionService.getSuggestionById(this.id).subscribe((data: any) => {
    const s = data.suggestion;
    this.suggestionForm.patchValue({
      title: s.title,
      description: s.description,
      category: s.category,
      status: s.status
    });
    // date et status sont disabled, on les met à jour via setValue sur le control
    this.suggestionForm.get('date')?.setValue(
      new Date(s.date).toLocaleDateString('fr-FR')
    );
    this.suggestionForm.get('status')?.setValue(s.status);
  });
}
  }

  getTodayDate(): string {
    return new Date().toLocaleDateString('fr-FR');
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  onSubmit(): void {
    if (this.suggestionForm.invalid) return;

    const suggestion: Suggestion = {
      id: this.id || 0,
      title: this.suggestionForm.get('title')!.value,
      description: this.suggestionForm.get('description')!.value,
      category: this.suggestionForm.get('category')!.value,
      date: new Date(),
      status: 'en_attente',
      nbLikes: 0
    };

    if (this.isEditMode) {
      this.suggestionService.updateSuggestion(suggestion).subscribe({
        next: () => this.router.navigate(['/suggestions']),
        error: (err) => console.error('Erreur mise a jour', err)
      });
    } else {
      this.suggestionService.addSuggestion(suggestion).subscribe({
        next: () => this.router.navigate(['/suggestions']),
        error: (err) => console.error('Erreur ajout', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/suggestions']);
  }
}