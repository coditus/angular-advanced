import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoardModal } from './add-board-modal';

describe('AddBoardModal', () => {
  let component: AddBoardModal;
  let fixture: ComponentFixture<AddBoardModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoardModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBoardModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
