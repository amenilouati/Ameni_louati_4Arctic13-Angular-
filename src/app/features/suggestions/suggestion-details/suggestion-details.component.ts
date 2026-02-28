import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';
@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion: Suggestion | undefined;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  
  ngOnInit(): void {
  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.suggestionService.getSuggestionById(this.id).subscribe({
    next: (data: any) => {
      this.suggestion = data.suggestion;
    },
    error: (err) => console.error('Erreur chargement détails', err)
  });
}

  getStatusLabel(status: string): string {
    switch (status) {
      case 'acceptee': return 'ACCEPTÉE';
      case 'refusee': return 'REFUSÉE';
      case 'en_attente': return 'EN ATTENTE';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'acceptee': return 'badge-accepted';
      case 'refusee': return 'badge-refused';
      case 'en_attente': return 'badge-pending';
      default: return '';
    }
  }

  
  updateSuggestion(): void {
    this.router.navigate(['/suggestions/edit', this.id]);
  }

  backToList(): void {
    this.router.navigate(['/suggestions']);
  }
}