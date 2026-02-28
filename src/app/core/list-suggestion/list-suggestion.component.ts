import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../models/suggestion';
import { SuggestionService } from '../Services/suggestion.service';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {

  suggestions: Suggestion[] = [];
  searchTerm: string = '';
  favorites: Suggestion[] = [];

  constructor(private router: Router, private suggestionService: SuggestionService) {}

 
  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => this.suggestions = data,
      error: (err) => console.error('Erreur chargement suggestions', err)
    });
  }

  get filteredSuggestions(): Suggestion[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.suggestions;
    return this.suggestions.filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  }

  
  like(suggestion: Suggestion): void {
  suggestion.nbLikes++;
  this.suggestionService.updateLikes(suggestion).subscribe({
    next: () => console.log('Like mis à jour'),
    error: (err) => {
      suggestion.nbLikes--; // rollback
      console.error('Erreur like', err);
    }
  });
}


  deleteSuggestion(suggestion: Suggestion): void {
    if (confirm(`Supprimer "${suggestion.title}" ?`)) {
      this.suggestionService.deleteSuggestion(suggestion.id).subscribe({
        next: () => this.loadSuggestions(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  addToFavorites(suggestion: Suggestion): void {
    if (!this.favorites.find(f => f.id === suggestion.id)) {
      this.favorites.push(suggestion);
    }
  }

  isInFavorites(suggestion: Suggestion): boolean {
    return !!this.favorites.find(f => f.id === suggestion.id);
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

  viewDetails(suggestion: Suggestion): void {
    this.router.navigate(['/suggestions', suggestion.id]);
  }

  addSuggestion(): void {
    this.router.navigate(['/suggestions/add']);
  }
}