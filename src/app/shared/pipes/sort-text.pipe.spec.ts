import { SortTextPipe } from './sort-text.pipe';
import { SortEnum } from '@shared/enums/sort.enum'; // ← adjust path if needed

describe('SortTextPipe', () => {
  let pipe: SortTextPipe;

  beforeEach(() => {
    // Arrange
    pipe = new SortTextPipe();
  });

  it('should return an empty array when input is null', () => {
    // Arrange
    const input = null;

    // Act
    const result = pipe.transform(input as any);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return an empty array when input is undefined', () => {
    // Arrange
    const input = undefined;

    // Act
    const result = pipe.transform(input as any);

    // Assert
    expect(result).toEqual([]);
  });

  it('should not mutate the original array', () => {
    // Arrange
    const input = ['b', 'A', 'a10', 'a2'] as const;

    // Act
    const _ = pipe.transform([...input], SortEnum.asc);

    // Assert
    expect(input).toEqual(['b', 'A', 'a10', 'a2']);
  });

  it('should sort ascending by default (case-insensitive, numeric aware)', () => {
    // Arrange
    const input = ['b', 'A', 'a10', 'a2'];

    // Act
    const result = pipe.transform(input, SortEnum.asc, 'en', true);

    // Assert
    expect(result).toEqual(['A', 'a2', 'a10', 'b']);
  });

  it('should sort descending when order is desc', () => {
    // Arrange
    const input = ['b', 'A', 'a10', 'a2'];

    // Act
    const result = pipe.transform(input, SortEnum.desc, 'en', true);

    // Assert
    expect(result).toEqual(['b', 'a10', 'a2', 'A']);
  });

  it('should respect caseInsensitive = false (uppercase/lowercase matters)', () => {
    // Arrange
    const input = ['beta', 'Alpha'];

    // Act
    const resultAsc   = pipe.transform(input, SortEnum.asc,  'en', false);
    const resultDesc  = pipe.transform(input, SortEnum.desc, 'en', false);

    // Assert
    // With case sensitivity, 'Alpha' typically comes before 'beta' in 'en'
    expect(resultAsc).toEqual(['Alpha', 'beta']);
    expect(resultDesc).toEqual(['beta', 'Alpha']);
  });

  it('should handle already sorted input', () => {
    // Arrange
    const input = ['a', 'b', 'c'];

    // Act
    const result = pipe.transform(input, SortEnum.asc);

    // Assert
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should handle duplicates correctly', () => {
    // Arrange
    const input = ['apple', 'Apple', 'banana', 'banana'];

    // Act
    const result = pipe.transform(input, SortEnum.asc, 'en', true);

    // Assert
    expect(result).toEqual(['apple', 'Apple', 'banana', 'banana']);
  });
});
