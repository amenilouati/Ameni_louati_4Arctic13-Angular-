import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Suggestion } from '../../models/suggestion';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  suggestionUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient) {}

  
  getSuggestionsList() {
    return this.http.get<Suggestion[]>(this.suggestionUrl);
  }

  
  getSuggestionById(id: number){
    return this.http.get<Suggestion>(`${this.suggestionUrl}/${id}`);
  }

 
  addSuggestion(suggestion: Suggestion) {
    return this.http.post<Suggestion>(this.suggestionUrl, suggestion);
  }

  
  deleteSuggestion(id: number){
    return this.http.delete(`${this.suggestionUrl}/${id}`);
  }

  
  updateSuggestion(suggestion: Suggestion) {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${suggestion.id}`, suggestion);
  }

  
  updateLikes(suggestion: Suggestion) {
  return this.http.put<any>(`${this.suggestionUrl}/${suggestion.id}`, suggestion).pipe(
    map(data => data.suggestion ?? data)
  );
}
}